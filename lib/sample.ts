import type { Analysis } from "./schema";

export const SAMPLE_JOB = `Junior Full-Stack Developer (React / Node.js) - Remote

We're a fintech startup helping small businesses get paid faster. You'll join a team of 6 engineers shipping features weekly.

What you'll do
- Build user-facing features in React and TypeScript
- Design and maintain REST APIs in Node.js / Express with PostgreSQL
- Write unit and integration tests (Jest, Playwright)
- Work with Git, pull requests and CI/CD on GitHub Actions
- Deploy to AWS (Lambda, S3) or Vercel

You have
- 1+ years building web apps (internships and serious side projects count)
- Strong JavaScript/TypeScript and React fundamentals
- Experience with SQL databases
- Bonus: Docker, Tailwind CSS, experience integrating LLM APIs`;

export const SAMPLE_CV = `SARA AHMED (sample candidate) - Software Developer - Karachi, Pakistan

SKILLS
JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, HTML, CSS, Tailwind, Git, Python

EXPERIENCE
Web Developer Intern - TechNest Solutions (Jun 2025 - Dec 2025)
- Worked on the company dashboard using React
- Made APIs for the mobile app
- Fixed bugs reported by the QA team
- Helped migrate the website to Next.js

PROJECTS
ResumeFit AI - Next.js app that uses the Claude API to score a CV against a job post
Chat app - Real-time chat with Socket.io and MongoDB

EDUCATION
BS Computer Science - 2026`;

export const SAMPLE_RESULT: Analysis = {
  score: 72,
  verdict:
    "Solid React and Node foundation with relevant AI side projects; needs SQL, testing and cloud evidence to be shortlisted.",
  role_title: "Junior Full-Stack Developer (React / Node.js)",
  strengths: [
    "Hands-on React and Next.js experience from a real internship",
    "Built APIs in Node.js / Express, matching the core backend stack",
    "Has already integrated an LLM API (ResumeFit AI), a listed bonus",
    "Real-time chat project shows comfort beyond CRUD apps",
  ],
  skills: [
    { skill: "React", status: "strong", evidence: "Built the company dashboard in React during the internship." },
    { skill: "TypeScript", status: "partial", evidence: "Listed in skills, but no bullet shows it being used." },
    { skill: "Node.js / Express REST APIs", status: "strong", evidence: "Made APIs for the mobile app at TechNest." },
    { skill: "PostgreSQL / SQL", status: "missing", evidence: "Only MongoDB appears; no relational database experience shown." },
    { skill: "Testing (Jest, Playwright)", status: "missing", evidence: "No mention of writing tests." },
    { skill: "Git and pull requests", status: "partial", evidence: "Git is listed, but PR or code review workflow is not described." },
    { skill: "CI/CD (GitHub Actions)", status: "missing", evidence: "No CI/CD experience mentioned." },
    { skill: "AWS or Vercel deployment", status: "missing", evidence: "No deployment or hosting experience shown." },
    { skill: "Tailwind CSS", status: "strong", evidence: "Listed in skills." },
    { skill: "LLM API integration", status: "strong", evidence: "ResumeFit AI uses the Claude API." },
    { skill: "Docker", status: "missing", evidence: "Not mentioned." },
  ],
  missing_keywords: ["PostgreSQL", "Jest", "Playwright", "GitHub Actions", "CI/CD", "AWS", "Lambda", "Docker", "REST"],
  rewrites: [
    {
      original: "Worked on the company dashboard using React",
      improved:
        "Built 6 React + TypeScript dashboard features used by [X] internal staff, cutting report preparation time by [X%]",
      why: "Leads with an action verb, adds TypeScript and gives a measurable outcome.",
    },
    {
      original: "Made APIs for the mobile app",
      improved:
        "Designed and shipped [X] REST endpoints in Node.js / Express powering the company's mobile app for [X] users",
      why: "Uses the job's exact keywords (REST, Node.js, Express) and shows scale.",
    },
    {
      original: "Fixed bugs reported by the QA team",
      improved: "Resolved [X] QA-reported bugs through reviewed pull requests, reducing open defects by [X%] before release",
      why: "Turns maintenance into impact and signals a PR-based Git workflow.",
    },
  ],
  next_steps: [
    "Add Jest tests and a GitHub Actions workflow to one public project, then mention it on the CV",
    "Swap MongoDB for PostgreSQL in a side project (or add a Postgres version) to cover the SQL requirement",
    "Deploy ResumeFit AI to Vercel and put the live link on your CV",
  ],
};
