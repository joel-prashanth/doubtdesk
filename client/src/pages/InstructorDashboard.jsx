import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

function DoubtRow({ doubt, onAnswered }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api(`/doubts/${doubt._id}/answer`, {
        method: "PATCH",
        body: { answer },
      });
      onAnswered(doubt._id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <li className="border-b border-ink/20 py-6">
      <p className="text-sm text-ink/70">
        {doubt.user.name} ({doubt.user.email}) on{" "}
        <span className="font-medium text-ink">{doubt.problem.title}</span>
      </p>
      <p className="mt-2 whitespace-pre-wrap text-lg">{doubt.message}</p>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-medium text-cobalt">
          View their code
        </summary>
        <pre className="mt-2 overflow-x-auto rounded-[3px] border border-ink/30 bg-white p-4 font-mono text-sm">
          {doubt.code}
        </pre>
      </details>

      {doubt.status === "answered" ? (
        <p className="mt-4 max-w-prose whitespace-pre-wrap border-l-2 border-cobalt pl-4 leading-relaxed">
          {doubt.answer}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor={`a-${doubt._id}`} className="text-sm font-medium">
            Your answer
          </label>
          <textarea
            id={`a-${doubt._id}`}
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-1 block h-24 w-full resize-y rounded-[3px] border-2 border-ink bg-white p-3 outline-none focus:border-cobalt"
          />
          {error && (
            <p role="alert" className="mt-2 text-sm font-medium text-fail">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="mt-3 rounded-[4px] bg-cobalt px-5 py-2.5 font-semibold text-white active:translate-y-px disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send answer"}
          </button>
        </form>
      )}
    </li>
  );
}

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState("open");
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api(`/doubts?status=${status}`)
      .then(setDoubts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status]);

  if (user.role === "student") return <Navigate to="/" replace />;

  const tab = (value, label) => (
    <button
      onClick={() => setStatus(value)}
      aria-pressed={status === value}
      className={`pb-1 font-semibold ${status === value ? "border-b-2 border-ink" : "text-ink/60"}`}
    >
      {label}
    </button>
  );

  return (
    <main className="mx-auto max-w-2xl px-6 pt-16 pb-24">
      <Link
        to="/"
        className="text-sm font-medium text-cobalt underline underline-offset-4"
      >
        All problems
      </Link>
      <h1 className="mt-6 text-3xl font-bold">Student doubts</h1>

      <div className="mt-6 flex gap-6">
        {tab("open", "Open")}
        {tab("answered", "Answered")}
      </div>

      {loading && <p className="mt-8 text-ink/70">Loading doubts…</p>}
      {error && (
        <p role="alert" className="mt-8 font-medium text-fail">
          {error}
        </p>
      )}
      {!loading && !error && doubts.length === 0 && (
        <p className="mt-8 text-ink/70">
          {status === "open"
            ? "No open doubts. Nothing is waiting on you."
            : "No answered doubts yet."}
        </p>
      )}

      <ul className="mt-4 border-t border-ink/20">
        {doubts.map((d) => (
          <DoubtRow
            key={d._id}
            doubt={d}
            onAnswered={(id) =>
              setDoubts((prev) => prev.filter((x) => x._id !== id))
            }
          />
        ))}
      </ul>
    </main>
  );
}
