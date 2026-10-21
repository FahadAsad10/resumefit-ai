import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { Analysis } from "@/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_PDF_BYTES = 8 * 1024 * 1024;

const SYSTEM = `You are a senior technical recruiter and resume coach.
You compare one candidate's CV against one job post and give honest, specific feedback.
Score fairly: 85+ means "would shortlist today", 60-84 "worth applying after edits", below 60 "significant gaps".
Only cite evidence that is actually in the CV. Never invent experience, employers, numbers or skills for the candidate.
When you rewrite a bullet, keep every fact true to the original; where a metric would help but is unknown, use a clear placeholder like [X%].`;

const client = new Anthropic();

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add your key." },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const job = String(form.get("job") ?? "").trim();
  const cvText = String(form.get("cvText") ?? "").trim();
  const cvFile = form.get("cvFile");

  if (job.length < 80) {
    return Response.json({ error: "Paste the full job post (at least a few lines)." }, { status: 400 });
  }

  const content: Anthropic.ContentBlockParam[] = [];

  if (cvFile instanceof File && cvFile.size > 0) {
    if (cvFile.type !== "application/pdf") {
      return Response.json({ error: "CV upload must be a PDF." }, { status: 400 });
    }
    if (cvFile.size > MAX_PDF_BYTES) {
      return Response.json({ error: "PDF is larger than 8 MB." }, { status: 400 });
    }
    const data = Buffer.from(await cvFile.arrayBuffer()).toString("base64");
    content.push({
      type: "document",
      title: "Candidate CV",
      source: { type: "base64", media_type: "application/pdf", data },
    });
  } else if (cvText.length >= 80) {
    content.push({ type: "text", text: `<cv>\n${cvText}\n</cv>` });
  } else {
    return Response.json({ error: "Upload your CV as a PDF or paste its text." }, { status: 400 });
  }

  content.push({
    type: "text",
    text: `<job_post>\n${job}\n</job_post>\n\nAnalyse how well the CV above fits this job post.`,
  });

  try {
    const response = await client.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: zodOutputFormat(Analysis) },
      system: SYSTEM,
      messages: [{ role: "user", content }],
    });

    if (response.stop_reason === "refusal") {
      return Response.json({ error: "Claude declined to analyse this input." }, { status: 422 });
    }
    if (!response.parsed_output) {
      return Response.json({ error: "Could not read the analysis. Please try again." }, { status: 502 });
    }
    return Response.json(response.parsed_output);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Rate limited by the API. Wait a moment and retry." }, { status: 429 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Your ANTHROPIC_API_KEY was rejected." }, { status: 401 });
    }
    if (err instanceof Anthropic.APIError) {
      return Response.json({ error: `API error: ${err.message}` }, { status: 502 });
    }
    throw err;
  }
}
