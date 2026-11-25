import { useEffect, useState } from "react";
import { api } from "../api";

export default function AskInstructor({ problemId, code }) {
  const [doubts, setDoubts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    api("/doubts/mine")
      .then((all) => setDoubts(all.filter((d) => d.problem._id === problemId)))
      .catch((err) => setError(err.message));
  }

  useEffect(load, [problemId]);

  const hasOpen = doubts.some((d) => d.status === "open");

  async function handleSend(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api("/doubts", { method: "POST", body: { problemId, code, message } });
      setMessage("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold">Still stuck?</h2>
      <p className="mt-1 text-ink/70">
        Send your current code and a question to your instructor.
      </p>

      <ul className="mt-4 border-t border-ink/20">
        {doubts.map((d) => (
          <li key={d._id} className="border-b border-ink/20 py-4">
            <p className={`text-sm font-semibold ${d.status === "answered" ? "text-pass" : "text-ink"}`}>
              {d.status === "answered" ? "Answered" : "Waiting for your instructor"}
            </p>
            <p className="mt-1 whitespace-pre-wrap">{d.message}</p>
            {d.answer && (
              <p className="mt-3 max-w-prose whitespace-pre-wrap border-l-2 border-cobalt pl-4 leading-relaxed">
                {d.answer}
              </p>
            )}
          </li>
        ))}
      </ul>

      {!hasOpen && (
        <form onSubmit={handleSend} className="mt-4">
          <label htmlFor="doubt" className="text-sm font-medium">Your question</label>
          <textarea
            id="doubt"
            required
            maxLength={500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block h-24 w-full resize-y rounded-[3px] border-2 border-ink bg-white p-3 outline-none focus:border-cobalt"
          />
          <p className="mt-1 text-sm text-ink/70">{message.length} / 500</p>

          {error && <p role="alert" className="mt-2 text-sm font-medium text-fail">{error}</p>}

          <button
            disabled={busy}
            className="mt-3 rounded-[4px] bg-cobalt px-5 py-2.5 font-semibold text-white active:translate-y-px disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send to instructor"}
          </button>
        </form>
      )}
    </section>
  );
}