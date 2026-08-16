export const PRESETS = [
  {
    id: "software_engineer",
    name: "Software Engineer (Full-Stack)",
    data: {
      title: "Software Engineer Resume",
      template: "modern",
      accent: "#2563eb",
      personal: {
        fullName: "Alex Rivera",
        jobTitle: "Senior Full-Stack Engineer",
        email: "alex.rivera@example.com",
        phone: "+1 (555) 382-9102",
        location: "San Francisco, CA",
        website: "https://alexrivera.dev",
        linkedin: "linkedin.com/in/alexrivera-dev",
        github: "github.com/alexrivera",
        summary:
          "Senior Full-Stack Engineer with 5+ years building microservices, REST/GraphQL APIs, and React apps. Cut application latency by 45% and led engineering teams across multiple products.",
      },
      experience: [
        {
          company: "TechScale Innovations",
          role: "Senior Full-Stack Developer",
          location: "San Francisco, CA",
          startDate: "Jan 2022",
          endDate: "Present",
          current: true,
          bullets: [
            "Built microservices handling 2M+ daily API requests with Node.js, Express, and Redis.",
            "Built responsive React dashboards, improving web vitals and cutting page load times by 40%.",
            "Led migration from monolithic DB to sharded MongoDB cluster with 99.99% uptime.",
            "Mentored 6 junior devs and set up CI/CD via GitHub Actions, speeding up releases by 35%.",
          ],
        },
        {
          company: "CloudSync Inc.",
          role: "Software Developer",
          location: "Austin, TX",
          startDate: "Jun 2019",
          endDate: "Dec 2021",
          current: false,
          bullets: [
            "Developed and maintained real-time collaborative workspace features using WebSockets and Node.js.",
            "Reduced AWS infrastructure costs by $18,000 annually by optimizing database queries and container auto-scaling.",
            "Integrated stripe payment gateways and automated invoice generation for over 50,000 paying SaaS subscribers.",
          ],
        },
      ],
      education: [
        {
          school: "University of California, Berkeley",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "Sep 2015",
          endDate: "May 2019",
          grade: "3.8 GPA",
        },
      ],
      projects: [
        {
          name: "DevPulse - API Monitoring Platform",
          description:
            "Built an automated synthetic monitoring tool checking endpoint health every 60 seconds with real-time Slack/SMS alerts.",
          link: "https://github.com/alexrivera/devpulse",
          tech: ["Node.js", "React", "MongoDB", "Docker", "Tailwind CSS"],
        },
        {
          name: "SmartForm ATS Parser",
          description:
            "Created an open-source resume parsing & matching engine powered by keyword frequency vectors and NLP heuristics.",
          link: "https://github.com/alexrivera/ats-parser",
          tech: ["TypeScript", "Express", "Jest", "Vite"],
        },
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2023",
        },
        {
          name: "MongoDB Certified Developer",
          issuer: "MongoDB Inc.",
          date: "2022",
        },
      ],
      skills: [
        "JavaScript",
        "TypeScript",
        "React.js",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "REST API",
        "Docker",
        "AWS",
        "Git",
        "CI/CD",
        "System Design",
      ],
      languages: ["English (Native)", "Spanish (Professional)"],
    },
  },
  {
    id: "data_scientist",
    name: "Data Scientist & AI Specialist",
    data: {
      title: "Data Scientist Resume",
      template: "classic",
      accent: "#0ea5e9",
      personal: {
        fullName: "Dr. Elena Rostova",
        jobTitle: "Senior Data Scientist",
        email: "elena.rostova@example.com",
        phone: "+1 (555) 948-2301",
        location: "New York, NY",
        website: "https://elenarostova.ai",
        linkedin: "linkedin.com/in/elena-rostova",
        github: "github.com/elena-ai",
        summary:
          "Data Scientist with 6+ years in predictive modeling, NLP, and ML pipelines. Built fraud detection models that saved clients $4.2M/year.",
      },
      experience: [
        {
          company: "Nexus Analytics Corp",
          role: "Lead Data Scientist",
          location: "New York, NY",
          startDate: "Mar 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Designed customer churn prediction model with XGBoost & PyTorch, increasing customer retention by 22% within 6 months.",
            "Deployed real-time NLP classification models processing 500,000 daily customer sentiment tickets with 94.2% accuracy.",
            "Built automated ETL pipelines using Apache Spark, Snowflake, and Python, scaling data throughput by 500%.",
          ],
        },
      ],
      education: [
        {
          school: "Columbia University",
          degree: "Master of Science",
          field: "Data Science & Statistics",
          startDate: "2018",
          endDate: "2020",
          grade: "3.9 GPA",
        },
      ],
      projects: [
        {
          name: "HealthPredict ML Engine",
          description:
            "Clinical decision support system utilizing deep neural networks to forecast patient readmission risk.",
          link: "https://github.com/elena-ai/healthpredict",
          tech: ["Python", "TensorFlow", "Scikit-Learn", "FastAPI"],
        },
      ],
      certifications: [
        {
          name: "TensorFlow Certified Developer",
          issuer: "Google",
          date: "2022",
        },
      ],
      skills: [
        "Python",
        "SQL",
        "R",
        "PyTorch",
        "TensorFlow",
        "Scikit-Learn",
        "Machine Learning",
        "NLP",
        "Pandas",
        "NumPy",
        "Snowflake",
        "Tableau",
      ],
      languages: ["English", "German"],
    },
  },
  {
    id: "product_manager",
    name: "Product Manager",
    data: {
      title: "Product Manager Resume",
      template: "elegant",
      accent: "#7c3aed",
      personal: {
        fullName: "Marcus Vance",
        jobTitle: "Senior Product Manager",
        email: "marcus.vance@example.com",
        phone: "+1 (555) 720-4491",
        location: "Seattle, WA",
        website: "https://marcusvance.com",
        linkedin: "linkedin.com/in/marcusvance",
        github: "",
        summary:
          "Senior Product Manager with 7+ years in SaaS — customer discovery, A/B testing, and working across eng and design. Grew ARR from $2M to $15M in 3 years.",
      },
      experience: [
        {
          company: "SaaSify Cloud",
          role: "Lead Product Manager",
          location: "Seattle, WA",
          startDate: "Jan 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Owned end-to-end product roadmap for enterprise billing & onboarding, boosting onboarding conversion rate by 38%.",
            "Executed 40+ user interviews and quantitative survey studies, defining key features for Q3 product release.",
            "Collaborated with UX and Engineering teams across 2 week sprint cycles to launch self-serve upgrade flows, generating $1.8M ARR.",
          ],
        },
      ],
      education: [
        {
          school: "University of Washington",
          degree: "Bachelor of Business Administration",
          field: "Information Systems",
          startDate: "2013",
          endDate: "2017",
          grade: "",
        },
      ],
      projects: [
        {
          name: "GrowthLoop Analytics",
          description: "Framework and dashboard for tracking SaaS product metrics (CAC, LTV, Retention, Churn).",
          link: "https://growthloop.io",
          tech: ["Product Analytics", "Mixpanel", "Jira", "Figma"],
        },
      ],
      certifications: [
        {
          name: "Certified Scrum Product Owner (CSPO)",
          issuer: "Scrum Alliance",
          date: "2021",
        },
      ],
      skills: [
        "Product Roadmap",
        "User Research",
        "A/B Testing",
        "Agile / Scrum",
        "Mixpanel",
        "Google Analytics",
        "Wireframing",
        "Figma",
        "Data Analysis",
        "Customer Discovery",
      ],
      languages: ["English"],
    },
  },
];
