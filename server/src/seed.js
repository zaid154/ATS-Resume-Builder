import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Resume } from "./models/Resume.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load single root .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function seedDatabase() {
  try {
    console.log("🌱 Connecting to MongoDB Atlas for seeding...");
    console.log("URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB Atlas");

    // Clear existing data
    await User.deleteMany({});
    await Resume.deleteMany({});
    console.log("🧹 Cleared old Users and Resumes collections.");

    // 1. Create Admin User (Mohd Zaid)
    const adminUser = await User.create({
      name: "Mohd Zaid (Admin)",
      email: "zaidm1323@gmail.com",
      password: "password123",
      role: "admin",
    });
    console.log(`👤 Admin created: ${adminUser.email} (ID: ${adminUser._id})`);

    // 2. Create Demo Regular User
    const demoUser = await User.create({
      name: "John Doe",
      email: "demo@example.com",
      password: "password123",
      role: "user",
    });
    console.log(`👤 Demo User created: ${demoUser.email} (ID: ${demoUser._id})`);

    // 3. Create Sample Resumes for Admin (Mohd Zaid)
    const adminResume1 = await Resume.create({
      user: adminUser._id,
      title: "Senior Full-Stack Engineer ATS Resume",
      template: "modern",
      accent: "#2563eb",
      personal: {
        fullName: "Mohd Zaid",
        jobTitle: "Senior Full-Stack MERN Engineer",
        email: "zaidm1323@gmail.com",
        phone: "+91 9876543210",
        location: "New Delhi, India",
        website: "https://portfolio-zeta-drab-97.vercel.app/",
        linkedin: "https://www.linkedin.com/in/mohd-zaid-794090231/",
        github: "https://github.com/zaid154",
        summary: "Full-Stack Developer with 4+ years building web apps with React, Node.js, Express, and MongoDB. Experienced in ATS scoring systems and document rendering.",
      },
      experience: [
        {
          company: "TechCorp Solutions",
          role: "Lead Full-Stack Developer",
          location: "Remote / New Delhi",
          startDate: "2022-01",
          endDate: "Present",
          current: true,
          bullets: [
            "Built and shipped a microservices-based resume parsing system used by 50k+ monthly users.",
            "Improved MongoDB aggregation queries, cutting response times by 45%.",
            "Added JWT auth and security headers, passing all security audits.",
          ],
        },
        {
          company: "Innovate AI Labs",
          role: "Frontend Engineer",
          location: "Bangalore, India",
          startDate: "2020-06",
          endDate: "2021-12",
          current: false,
          bullets: [
            "Built React dashboards with real-time analytics over WebSockets.",
            "Created 16+ reusable UI templates with custom typography and CSS variables.",
          ],
        },
      ],
      education: [
        {
          school: "Abdul Kalam Technical University",
          degree: "Bachelor of Technology",
          field: "Computer Science & Engineering",
          startDate: "2016-08",
          endDate: "2020-06",
          grade: "8.8 CGPA",
        },
      ],
      projects: [
        {
          name: "ATS Resume Builder & Analyzer",
          description: "MERN app with live ATS scoring, 16+ templates, and job description matching.",
          link: "https://github.com/zaid154/ATS-Resume-Builder",
          tech: ["React", "Node.js", "Express", "MongoDB", "Vite", "TailwindCSS"],
        },
      ],
      certifications: [
        { name: "AWS Certified Developer Associate", issuer: "Amazon Web Services", date: "2023-05" },
        { name: "MongoDB Certified Developer", issuer: "MongoDB Inc.", date: "2022-11" },
      ],
      skills: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript (ES6+)", "TypeScript", "REST APIs", "Git", "Docker", "Tailwind CSS"],
      languages: ["English (Fluent)", "Hindi (Native)"],
      lastScore: 94,
    });

    const adminResume2 = await Resume.create({
      user: adminUser._id,
      title: "AI Product Manager Resume",
      template: "tech",
      accent: "#059669",
      personal: {
        fullName: "Mohd Zaid",
        jobTitle: "AI Technical Product Lead",
        email: "zaidm1323@gmail.com",
        phone: "+91 9876543210",
        location: "Delhi, India",
        website: "https://portfolio-zeta-drab-97.vercel.app/",
        linkedin: "https://www.linkedin.com/in/mohd-zaid-794090231/",
        github: "https://github.com/zaid154",
        summary: "Product-focused engineer working on AI/ML features, user workflows, and analytics.",
      },
      skills: ["Product Strategy", "System Architecture", "MERN Stack", "A/B Testing", "Agile Leadership"],
      lastScore: 89,
    });

    // 4. Create Sample Resume for Demo User
    const demoResume = await Resume.create({
      user: demoUser._id,
      title: "Software Engineer Resume",
      template: "classic",
      accent: "#dc2626",
      personal: {
        fullName: "John Doe",
        jobTitle: "Frontend Software Developer",
        email: "demo@example.com",
        phone: "+1 (555) 019-2834",
        location: "San Francisco, CA",
        summary: "Frontend developer working with React, focused on clean code and accessibility.",
      },
      skills: ["React", "HTML5", "CSS3", "JavaScript", "Redux"],
      lastScore: 82,
    });

    console.log(`📄 Created 3 sample resumes in database!`);
    console.log(`   - ${adminResume1.title} (Score: ${adminResume1.lastScore}%)`);
    console.log(`   - ${adminResume2.title} (Score: ${adminResume2.lastScore}%)`);
    console.log(`   - ${demoResume.title} (Score: ${demoResume.lastScore}%)`);

    console.log("\n==========================================");
    console.log("🎉 Seeding done!");
    console.log("==========================================");
    console.log("Logins ready for testing:");
    console.log("1. Admin: zaidm1323@gmail.com / password123");
    console.log("2. User:  demo@example.com / password123");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

seedDatabase();
