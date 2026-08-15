// Client-side live score calculator for real-time feedback in the builder
// Evaluates completeness, action verbs, metrics, and content quality.

const ACTION_VERBS = new Set([
  "led", "managed", "built", "designed", "developed", "created", "implemented",
  "launched", "shipped", "improved", "increased", "reduced", "optimized", "delivered",
  "drove", "owned", "architected", "engineered", "automated", "streamlined", "migrated",
  "scaled", "mentored", "coordinated", "analyzed", "researched", "founded", "initiated",
  "established", "spearheaded", "orchestrated", "accelerated", "boosted", "generated",
  "grew", "resolved", "refactored", "deployed", "maintained", "integrated", "collaborated",
  "directed", "produced", "achieved", "authored", "executed", "formulated", "overhauled"
]);

function isPlaceholder(val) {
  if (!val || typeof val !== "string") return true;
  const clean = val.trim().toLowerCase();
  if (clean.length < 2) return true;
  // Detect placeholder strings like "jane doe", "john doe", "title", "email@example.com"
  const placeholders = [
    "jane doe", "john doe", "your name", "job title", "software engineer",
    "jane@email.com", "jane.doe@example.com", "janedoe.dev", "company name"
  ];
  // Check if string is a single character repeated like "aaaaa" or "asdfasdf"
  if (/^(.)\1+$/.test(clean) || clean === "asdf" || clean === "qwerty") return true;
  return false;
}

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function computeLiveScore(data) {
  if (!data) return { score: 0, label: "Empty" };

  let score = 0;
  const p = data.personal || {};

  // 1. Personal & Contact Quality (max 20)
  if (p.fullName && !isPlaceholder(p.fullName)) score += 4;
  if (p.jobTitle && !isPlaceholder(p.jobTitle)) score += 4;
  if (p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) score += 4;
  if (p.phone && p.phone.replace(/\D/g, "").length >= 7) score += 3;
  if (p.location && p.location.trim().length >= 2) score += 3;
  if ((p.linkedin || p.website || p.github) && !isPlaceholder(p.linkedin || p.website || p.github)) score += 2;

  // 2. Summary Quality (max 15)
  const summaryWords = countWords(p.summary);
  if (!isPlaceholder(p.summary)) {
    if (summaryWords >= 25 && summaryWords <= 75) score += 15; // Ideal summary length
    else if (summaryWords >= 12) score += 10;
    else if (summaryWords > 0) score += 5;
  }

  // 3. Work Experience & Bullet Quality (max 35)
  const expList = (data.experience || []).filter(e => e.role || e.company);
  if (expList.length >= 2) score += 10;
  else if (expList.length === 1) score += 5;

  const allBullets = expList
    .flatMap((e) => e.bullets || [])
    .map((b) => (b || "").trim())
    .filter((b) => b.length >= 15 && !isPlaceholder(b)); // Filter dummy short bullets

  if (allBullets.length >= 6) score += 12;
  else if (allBullets.length >= 3) score += 8;
  else if (allBullets.length > 0) score += 4;

  // Strong action verbs check
  const actionBullets = allBullets.filter((b) => {
    const firstWord = b.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
    return firstWord && ACTION_VERBS.has(firstWord);
  });

  if (actionBullets.length >= 4) score += 8;
  else if (actionBullets.length >= 2) score += 5;
  else if (actionBullets.length > 0) score += 2;

  // Measurable impact check (numbers, percentages, currency)
  const metricBullets = allBullets.filter((b) => /\b\d+(?:\.\d+)?%?\b|[\$€£₹]\d+|\b\d+x\b/i.test(b));
  if (metricBullets.length >= 3) score += 5;
  else if (metricBullets.length >= 1) score += 3;

  // 4. Skills Relevance & Diversity (max 15)
  const validSkills = Array.from(
    new Set((data.skills || []).map((s) => (s || "").trim().toLowerCase()).filter((s) => s.length >= 2))
  );

  if (validSkills.length >= 8) score += 15;
  else if (validSkills.length >= 5) score += 10;
  else if (validSkills.length >= 2) score += 5;

  // 5. Education Completeness (max 10)
  const validEdu = (data.education || []).filter((e) => (e.school || e.degree) && !isPlaceholder(e.school));
  if (validEdu.length >= 1) score += 10;

  // 6. Projects & Certifications (max 5)
  const validProjects = (data.projects || []).filter((pr) => pr.name && !isPlaceholder(pr.name));
  const validCerts = (data.certifications || []).filter((c) => c.name && !isPlaceholder(c.name));
  if (validProjects.length > 0 || validCerts.length > 0) score += 5;

  const finalScore = Math.min(100, Math.max(0, score));

  let label = "Needs work";
  if (finalScore >= 85) label = "Excellent";
  else if (finalScore >= 70) label = "Good";
  else if (finalScore >= 50) label = "Fair";

  return { score: finalScore, label };
}
