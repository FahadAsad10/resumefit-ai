"use client";

import { useState } from "react";
import type { Analysis } from "@/lib/schema";
import { SAMPLE_CV, SAMPLE_JOB, SAMPLE_RESULT } from "@/lib/sample";

const STATUS_LABEL = { strong: "Strong", partial: "Partial", missing: "Missing" } as const;

export default function Home() {
  const [job, setJob] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const body = new FormData();
    body.set("job", job);
    body.set("cvText", cvText);
    if (cvFile) body.set("cvFile", cvFile);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data as Analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setJob(SAMPLE_JOB);
    setCvText(SAMPLE_CV);
    setCvFile(null);
    setError(null);
    setResult(SAMPLE_RESULT);
  }

  async function copy(text: string, i: number) {
    await navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <main className="wrap">
      <header className="hero">
        <span className="pill">
          <i className="dot" /> Powered by Claude
        </span>
        <h1>
          Resume<span className="grad">Fit</span> AI
        </h1>
        <p className="lede">
          Paste a job post and your CV. Get a fit score, the skills you are missing, the keywords
          applicant-tracking systems look for, and stronger bullet points you can copy straight in.
        </p>
      </header>

      <form className="grid2" onSubmit={analyze}>
        <label className="card">
          <span className="label">Job post</span>
          <textarea
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={14}
          />
        </label>

        <div className="card">
          <span className="label">Your CV</span>
          <label className="drop">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            />
            {cvFile ? (
              <span>
                📄 {cvFile.name}{" "}
                <button type="button" className="link" onClick={() => setCvFile(null)}>
                  remove
                </button>
              </span>
            ) : (
              <span>Drop a PDF here or click to upload</span>
            )}
          </label>
          <div className="or">or paste the text</div>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste your CV text..."
            rows={8}
            disabled={!!cvFile}
          />
        </div>

        <div className="actions">
          <button className="primary" disabled={loading}>
            {loading ? "Analysing..." : "Analyse my fit"}
          </button>
          <button type="button" className="ghost" onClick={loadSample} disabled={loading}>
            See a sample result
          </button>
        </div>
      </form>

      {loading && (
        <div className="card shimmer" aria-live="polite">
          Claude is reading both documents and comparing them...
        </div>
      )}
      {error && <div className="card error">{error}</div>}

      {result && (
        <section className="results" aria-live="polite">
          <div className="card scorecard">
            <Ring score={result.score} />
            <div>
              <span className="label">{result.role_title}</span>
              <p className="verdict">{result.verdict}</p>
              <ul className="ticks">
                {result.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid2">
            <div className="card">
              <h2>Requirements</h2>
              <ul className="skills">
                {result.skills.map((s) => (
                  <li key={s.skill}>
                    <span className={`badge ${s.status}`}>{STATUS_LABEL[s.status]}</span>
                    <div>
                      <b>{s.skill}</b>
                      <small>{s.evidence}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="stack">
              <div className="card">
                <h2>Missing keywords</h2>
                <div className="chips">
                  {result.missing_keywords.length === 0 && <small>None, nice work.</small>}
                  {result.missing_keywords.map((k) => (
                    <span key={k} className="chip">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card">
                <h2>Next steps</h2>
                <ol className="steps">
                  {result.next_steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Bullet rewrites</h2>
            <div className="rewrites">
              {result.rewrites.map((r, i) => (
                <article key={r.original} className="rewrite">
                  <p className="before">{r.original}</p>
                  <p className="after">{r.improved}</p>
                  <div className="row">
                    <small>{r.why}</small>
                    <button type="button" className="ghost sm" onClick={() => copy(r.improved, i)}>
                      {copied === i ? "Copied" : "Copy"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="foot">
        Built by Fahad Shaikh with Next.js and the Claude API.{" "}
        <a href="https://github.com/FahadAsad10/resumefit-ai">Source on GitHub</a>
      </footer>
    </main>
  );
}

function Ring({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone = score >= 85 ? "var(--good)" : score >= 60 ? "var(--warn)" : "var(--bad)";
  return (
    <div className="ring" role="img" aria-label={`Fit score ${score} out of 100`}>
      <svg viewBox="0 0 120 120" width="132" height="132">
        <circle cx="60" cy="60" r={r} className="track" />
        <circle
          cx="60"
          cy="60"
          r={r}
          stroke={tone}
          className="bar"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <div className="num">
        <b>{score}</b>
        <small>/ 100</small>
      </div>
    </div>
  );
}
