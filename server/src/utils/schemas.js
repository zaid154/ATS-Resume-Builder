import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const experienceSchema = z.object({
  company: z.string().default(""),
  role: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
});

const educationSchema = z.object({
  school: z.string().default(""),
  degree: z.string().default(""),
  field: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  grade: z.string().default(""),
});

const projectSchema = z.object({
  name: z.string().default(""),
  description: z.string().default(""),
  link: z.string().default(""),
  tech: z.array(z.string()).default([]),
});

const certificationSchema = z.object({
  name: z.string().default(""),
  issuer: z.string().default(""),
  date: z.string().default(""),
});

const personalSchema = z.object({
  fullName: z.string().default(""),
  jobTitle: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  website: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
  summary: z.string().default(""),
});

export const resumeSchema = z.object({
  title: z.string().trim().max(120).optional().default("Untitled Resume"),
  template: z.string().optional().default("modern"),
  accent: z.string().optional().default("#2563eb"),
  personal: z.any().optional(),
  experience: z.any().optional(),
  education: z.any().optional(),
  projects: z.any().optional(),
  certifications: z.any().optional(),
  skills: z.any().optional(),
  languages: z.any().optional(),
  lastScore: z.any().optional(),
}).passthrough();


export const analyzeSchema = z.object({
  resumeId: z.string().optional(),
  resume: z.any().optional(),
  jobDescription: z.string().trim().min(1, "Paste a job description to analyze against"),
});
