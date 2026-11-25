import { useEffect, useState } from "react";
import { api } from "../api";
import AskInstructor from "./AskInstructor";
export default function HintLadder({ problemId, code }) {
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/hints?problemId=${problemId}`)
      .then(setHints)
      .catch((err) => setError(err.message));
  }, [problemId]);

  const used = hints.length ? Math.max(...hints.map((h) => h.level)) : 0;

  async function askHint() {
    setError("");
    setLoading(true);
    try {
      const h = await api("/hints", {
        method: "POST",
        body: { problemId, code },
      });
      setHints((prev) => [...prev, h]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-12">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Hints</h2>
        <div className="flex gap-1.5" aria-label={`${used} of 3 hints used`}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-2.5 w-9 rounded-[2px] border border-ink/40 transition-colors duration-300 ${
                n <= used
                  ? "border-highlighter bg-highlighter"
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      <ul className="mt-4 border-t border-ink/20">
        {hints.map((h) => (
          <li key={h.level} className="border-b border-ink/20 py-4">
            <span className="bg-highlighter px-1.5 text-sm font-semibold">
              Hint {h.level}
            </span>
            <p className="mt-2 max-w-prose whitespace-pre-wrap leading-relaxed">
              {h.text}
            </p>
          </li>
        ))}
      </ul>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-fail">
          {error}
        </p>
      )}

      {used < 3 && (
        <button
          onClick={askHint}
          disabled={loading}
          className="mt-4 rounded-[4px] border-2 border-ink px-4 py-2 font-semibold active:translate-y-px disabled:opacity-60"
        >
          {loading ? "Thinking…" : `Get hint ${used + 1}`}
        </button>
      )}

      {used >= 3 && <AskInstructor problemId={problemId} code={code} />}
    </section>
  );
}
