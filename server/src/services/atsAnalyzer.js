/**
 * ATS scoring engine
 *
 * Scores a resume against a job description using:
 * - Keyword matching with synonym normalization
 * - Required vs. preferred skill detection
 * - Action verb and impact checking
 * - Section completeness and word count
 */

const STOPWORDS = new Set(
  `a an and or the of to in on for with at by from as is are be will you your we our their they them this that these those it its into over under out up down off above below can could should would may might must have has had do does did not no nor so than too very just also about across after again against all am any because been before being between both during each few further here how into itself more most other some such only own same then there through until while who whom why work working role position job candidate team teams company companies looking seeking join help build using use used within per etc ability able strong good great excellent required requirement requirements responsibilities responsibility including include includes preferred plus years year experience experiences skill skills knowledge understanding proficient proficiency familiar familiarity ideal candidate opportunity opportunities environment applicants apply need needs needed hiring hire hired someone somebody want wants join joining bonus nice must-have`
    .split(/\s+/)
);

const ACTION_VERBS = new Set(
  `led managed built designed developed created implemented launched shipped improved increased reduced optimized delivered drove owned architected engineered automated streamlined migrated scaled mentored coordinated analyzed researched founded initiated established spearheaded orchestrated accelerated boosted generated grew resolved refactored deployed maintained integrated collaborated directed produced achieved authored executed formulated overhauled synthesized negotiated standardized transform`
    .split(/\s+/)
);

// Key multi-word technical and professional phrases to preserve during keyword extraction
const COMMON_PHRASES = [
  "react js", "react.js", "node js", "node.js", "express js", "express.js",
  "vue js", "vue.js", "next js", "next.js", "rest api", "restful api",
  "machine learning", "deep learning", "data science", "system design",
  "ci cd", "ci/cd", "cloud computing", "aws lambda", "tailwind css",
  "unit testing", "microservices", "docker container", "full stack",
  "frontend developer", "backend developer", "software engineer",
  "version control", "agile methodology", "scrum master", "database design",
  "object oriented", "search engine optimization", "user experience", "user interface",
  "product management", "a/b testing", "data visualization", "project manager"
];

// Synonym mapping to normalize equivalent terms
const SYNONYM_MAP = {
  "react.js": "react",
  "reactjs": "react",
  "node.js": "node.js",
  "nodejs": "node.js",
  "express.js": "express.js",
  "expressjs": "express.js",
  "vue.js": "vue",
  "vuejs": "vue",
  "next.js": "next.js",
  "nextjs": "next.js",
  "ts": "typescript",
  "js": "javascript",
  "postgres": "postgresql",
  "mongo": "mongodb",
  "aws": "aws",
  "gcp": "gcp",
  "cicd": "ci/cd",
  "ci/cd": "ci/cd",
  "restful api": "rest api",
  "rest apis": "rest api",
  "ui/ux": "ui/ux",
  "ui ux": "ui/ux",
  "ml": "machine learning",
  "ai": "artificial intelligence"
};

function normalizeTerm(term) {
  if (!term) return "";
  let clean = term.toLowerCase().trim().replace(/^[.\s]+|[.\s]+$/g, "");
  if (SYNONYM_MAP[clean]) return SYNONYM_MAP[clean];
  // Simple plural normalization (e.g., microservices -> microservice)
  if (clean.endsWith("s") && clean.length > 4 && !clean.endsWith("ss") && !clean.endsWith("is")) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ""))
    .filter(Boolean);
}

// Convert structured resume into searchable single text block
export function resumeToText(resume = {}) {
  const parts = [];
  const p = resume.personal || {};
  parts.push(p.fullName, p.jobTitle, p.summary, p.location);
  (resume.experience || []).forEach((e) => {
    parts.push(e.company, e.role, e.location, ...(e.bullets || []));
  });
  (resume.education || []).forEach((e) => parts.push(e.school, e.degree, e.field));
  (resume.projects || []).forEach((pr) =>
    parts.push(pr.name, pr.description, ...(pr.tech || []))
  );
  (resume.certifications || []).forEach((c) => parts.push(c.name, c.issuer));
  parts.push(...(resume.skills || []), ...(resume.languages || []));
  return parts.filter(Boolean).join("\n");
}

// Extract keywords from job description, differentiating required vs preferred terms
function extractKeywords(jobDescription, limit = 30) {
  if (!jobDescription) return [];
  const lowerJd = jobDescription.toLowerCase();
  
  // Identify required sections in JD
  const lines = jobDescription.split(/\r?\n/);
  const requiredLines = [];
  let isReqSection = false;

  for (const line of lines) {
    const l = line.toLowerCase();
    if (
      l.includes("requirement") ||
      l.includes("must have") ||
      l.includes("qualifications") ||
      l.includes("minimum") ||
      l.includes("what you need")
    ) {
      isReqSection = true;
    } else if (l.includes("preferred") || l.includes("nice to have") || l.includes("bonus")) {
      isReqSection = false;
    }
    if (isReqSection) requiredLines.push(line);
  }

  const reqText = requiredLines.join(" ").toLowerCase();
  const freqMap = new Map();

  // Check multi-word phrases first
  for (const phrase of COMMON_PHRASES) {
    if (lowerJd.includes(phrase)) {
      const norm = normalizeTerm(phrase);
      const isReq = reqText.includes(phrase) || lowerJd.includes(`required: ${phrase}`);
      freqMap.set(norm, {
        term: norm,
        raw: phrase,
        count: 2,
        isRequired: isReq || lowerJd.includes("required") || lowerJd.includes("must have"),
      });
    }
  }

  // Tokenize single terms
  const tokens = tokenize(jobDescription).filter(
    (t) => t.length > 2 && !STOPWORDS.has(t) && !/^\d+$/.test(t)
  );

  for (const t of tokens) {
    const norm = normalizeTerm(t);
    if (!freqMap.has(norm)) {
      const isReq = reqText.includes(t);
      freqMap.set(norm, {
        term: norm,
        raw: t,
        count: 1,
        isRequired: isReq,
      });
    } else {
      freqMap.get(norm).count += 1;
    }
  }

  return [...freqMap.values()]
    .sort((a, b) => (b.isRequired ? 2 : 1) * b.count - (a.isRequired ? 2 : 1) * a.count)
    .slice(0, limit);
}

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

// Calculate title similarity between resume job titles and JD target role
function evaluateTitleMatch(resume, jobDescription) {
  const p = resume.personal || {};
  const resumeTitles = [
    p.jobTitle,
    ...(resume.experience || []).map((e) => e.role)
  ].filter(Boolean).map(t => t.toLowerCase());

  if (!resumeTitles.length) return 40;

  const jdTokens = tokenize(jobDescription.slice(0, 300)); // Header of JD usually states title
  const commonRoleWords = ["engineer", "developer", "manager", "architect", "designer", "analyst", "lead", "specialist", "administrator", "scientist"];

  let bestMatchScore = 30;
  for (const title of resumeTitles) {
    const tTokens = tokenize(title);
    let matchCount = 0;
    for (const token of tTokens) {
      if (jdTokens.includes(token) || commonRoleWords.some(r => jdTokens.includes(r) && token.includes(r))) {
        matchCount++;
      }
    }
    const score = Math.round((matchCount / Math.max(tTokens.length, 1)) * 100);
    if (score > bestMatchScore) bestMatchScore = score;
  }

  return clamp(bestMatchScore, 30, 100);
}

export function analyzeResume(resume, jobDescription) {
  const resumeText = resumeToText(resume);
  const lowerResumeText = resumeText.toLowerCase();
  
  // Set of normalized tokens in resume to prevent keyword stuffing duplicate rewards
  const resumeTokensSet = new Set(tokenize(resumeText).map(normalizeTerm));

  const keywords = extractKeywords(jobDescription);
  const matched = [];
  const missing = [];
  const criticalMissing = [];

  let weightedEarned = 0;
  let weightedTotal = 0;

  if (keywords.length > 0) {
    for (const kw of keywords) {
      const weight = kw.isRequired ? 2.0 : 1.0;
      weightedTotal += weight;

      // Check set match
      const isMatched = kw.term.includes(" ")
        ? lowerResumeText.includes(kw.term)
        : resumeTokensSet.has(kw.term);

      if (isMatched) {
        matched.push(kw.term);
        weightedEarned += weight;
      } else {
        missing.push(kw.term);
        if (kw.isRequired) {
          criticalMissing.push(kw.term);
        }
      }
    }
  }

  const keywordScore = weightedTotal > 0
    ? Math.round((weightedEarned / weightedTotal) * 100)
    : 50;

  // 2. Job Title Match
  const titleScore = evaluateTitleMatch(resume, jobDescription);

  // 3. Contact completeness & validity
  const p = resume.personal || {};
  const contactChecks = [
    Boolean(p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())),
    Boolean(p.phone && p.phone.replace(/\D/g, "").length >= 7),
    Boolean(p.location && p.location.trim().length >= 2),
    Boolean(p.linkedin || p.website || p.github),
  ];
  const contactScore = Math.round(
    (contactChecks.filter(Boolean).length / contactChecks.length) * 100
  );

  // 4. Section completeness
  const sectionChecks = [
    Boolean(p.summary && p.summary.trim().length >= 30),
    (resume.experience || []).length > 0,
    (resume.education || []).length > 0,
    (resume.skills || []).length >= 4,
  ];
  const sectionScore = Math.round(
    (sectionChecks.filter(Boolean).length / sectionChecks.length) * 100
  );

  // 5. Measurable impact (numbers/percentages/currency in experience bullets)
  const allBullets = (resume.experience || [])
    .flatMap((e) => e.bullets || [])
    .map((b) => (b || "").trim())
    .filter((b) => b.length >= 15);

  const quantifiedBullets = allBullets.filter((b) => /\b\d+(?:\.\d+)?%?\b|[\$€£₹]\d+|\b\d+x\b/i.test(b));
  const impactScore = allBullets.length
    ? clamp(Math.round((quantifiedBullets.length / allBullets.length) * 100))
    : 0;

  // 6. Action verbs starting bullets
  const weakBullets = [];
  const strongBullets = allBullets.filter((b) => {
    const firstWord = tokenize(b)[0];
    const isStrong = firstWord && ACTION_VERBS.has(firstWord);
    if (!isStrong) weakBullets.push(b);
    return isStrong;
  });
  const actionScore = allBullets.length
    ? clamp(Math.round((strongBullets.length / allBullets.length) * 100))
    : 0;

  // 7. Word Count Density (ideal 250 - 850 words)
  const wordCount = tokenize(resumeText).length;
  let lengthScore = 100;
  if (wordCount < 180) lengthScore = clamp(Math.round((wordCount / 180) * 100));
  else if (wordCount > 900) lengthScore = clamp(100 - Math.round((wordCount - 900) / 15));

  const isJobAnalysis = Boolean((jobDescription || "").trim().length >= 20);

  const breakdown = [
    ...(isJobAnalysis
      ? [
          {
            key: "keywords",
            label: "Technical Keyword Match",
            weight: 0.35,
            score: keywordScore,
            tip:
              criticalMissing.length > 0
                ? `Critical missing skills: ${criticalMissing.slice(0, 4).join(", ")}.`
                : missing.length > 0
                ? `Include missing terms: ${missing.slice(0, 5).join(", ")}.`
                : "Excellent keyword alignment with job requirements.",
          },
          {
            key: "titleMatch",
            label: "Role & Title Alignment",
            weight: 0.15,
            score: titleScore,
            tip: "Ensure your current title and past roles reflect the target job title.",
          },
        ]
      : []),
    {
      key: "impact",
      label: "Measurable Impact",
      weight: isJobAnalysis ? 0.15 : 0.25,
      score: impactScore,
      tip: "Quantify achievements with metrics (e.g., 'reduced load times by 40%').",
    },
    {
      key: "actionVerbs",
      label: "Action Verbs & Bullet Strength",
      weight: isJobAnalysis ? 0.15 : 0.25,
      score: actionScore,
      tip: "Start every bullet point with a strong action verb (Led, Engineered, Built).",
    },
    {
      key: "sections",
      label: "Section Coverage",
      weight: isJobAnalysis ? 0.10 : 0.25,
      score: sectionScore,
      tip: "Ensure summary, experience, education, and skills sections are complete.",
    },
    {
      key: "contact",
      label: "Contact & Links",
      weight: isJobAnalysis ? 0.10 : 0.25,
      score: contactScore,
      tip: "Include valid email, phone, location, and professional profiles.",
    },
  ];

  const overall = clamp(
    Math.round(breakdown.reduce((sum, b) => sum + b.score * b.weight, 0))
  );

  const rating =
    overall >= 85 ? "Excellent" : overall >= 70 ? "Good" : overall >= 50 ? "Fair" : "Needs work";

  // Build Strengths & Weaknesses
  const strengths = [];
  const weaknesses = [];

  if (keywordScore >= 75) strengths.push("Good keyword match with the job description.");
  else weaknesses.push(`Missing key domain terms (${missing.slice(0, 4).join(", ") || "keywords"}).`);

  if (impactScore >= 50) strengths.push("Great use of quantitative metrics, percentages, and performance results.");
  else weaknesses.push("Bullet points lack quantifiable metrics (e.g. %, $, numbers, time saved).");

  if (actionScore >= 60) strengths.push("Bullet points start with clear action verbs.");
  else weaknesses.push("Several experience bullets start with weak or passive wording.");

  if (titleScore >= 75) strengths.push("Job title and experience roles closely match target role requirements.");

  // Actionable prioritized suggestions
  const suggestions = [];
  if (criticalMissing.length > 0) {
    suggestions.push({
      priority: "high",
      text: `Add critical missing skills required by job: ${criticalMissing.slice(0, 6).join(", ")}.`,
    });
  } else if (missing.length > 0) {
    suggestions.push({
      priority: "high",
      text: `Try adding these keywords: ${missing.slice(0, 6).join(", ")}.`,
    });
  }
  if (impactScore < 50) {
    suggestions.push({
      priority: "high",
      text: "Quantify achievements with metrics (%, $, user count, time saved, revenue growth).",
    });
  }
  if (actionScore < 60) {
    suggestions.push({
      priority: "medium",
      text: "Start bullet points with action verbs (e.g. Built, Led, Improved, Reduced).",
    });
  }
  if (contactScore < 100) {
    suggestions.push({
      priority: "medium",
      text: "Add complete contact details (Email, Phone, Location, Portfolio/LinkedIn).",
    });
  }

  if (!suggestions.length) {
    suggestions.push({ priority: "low", text: "Resume is strong! Tailor minor details for each application." });
  }

  return {
    score: overall,
    rating,
    wordCount,
    breakdown,
    matchedKeywords: matched,
    missingKeywords: missing,
    criticalMissing,
    totalKeywords: keywords.length,
    weakBullets: weakBullets.slice(0, 5),
    strengths,
    weaknesses,
    suggestions,
  };
}
