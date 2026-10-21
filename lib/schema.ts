import { z } from "zod";

export const SkillMatch = z.object({
  skill: z.string().describe("A skill or requirement taken from the job post"),
  status: z.enum(["strong", "partial", "missing"]),
  evidence: z
    .string()
    .describe("Where the CV shows it, or what is missing. One short sentence."),
});

export const BulletRewrite = z.object({
  original: z.string().describe("The bullet exactly as it appears in the CV"),
  improved: z
    .string()
    .describe("Rewritten with a strong verb, the job's keywords and a measurable result"),
  why: z.string().describe("One short sentence on what changed"),
});

export const Analysis = z.object({
  score: z.number().int().min(0).max(100).describe("Overall fit for this role, 0-100"),
  verdict: z.string().describe("One sentence a recruiter would say after reading both"),
  role_title: z.string(),
  strengths: z.array(z.string()).describe("Top 3-5 reasons this candidate fits"),
  skills: z.array(SkillMatch).describe("8-14 of the most important requirements"),
  missing_keywords: z
    .array(z.string())
    .describe("ATS keywords in the job post that never appear in the CV"),
  rewrites: z.array(BulletRewrite).describe("The 3-5 CV bullets that gain the most from a rewrite"),
  next_steps: z.array(z.string()).describe("3 concrete actions to raise the score before applying"),
});

export type Analysis = z.infer<typeof Analysis>;
