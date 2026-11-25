import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { runTests } from "../runTests";
import HintLadder from "../components/HintLadder";

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  async function handleRun() {
    const result = runTests(code, problem.functionName, problem.testCases);
    setReport(result);
    if (result.error) return;

    try {
      await api("/submissions", {
        method: "POST",
        body: {
          problemId: problem._id,
          code,
          passedCount: result.results.filter((r) => r.passed).length,
          totalCount: result.results.length,
        },
      });
      loadSubmissions();
    } catch {
      // saving failed; the results on screen are still valid
    }
  }

  function loadSubmissions() {
    api(`/submissions/mine?problemId=${id}`)
      .then(setSubmissions)
      .catch(() => {});
  }

  useEffect(() => {
    api(`/problems/${id}`)
      .then((p) => {
        setProblem(p);
        setCode(p.starterCode);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    loadSubmissions();
  }, [id]);

  if (error)
    return (
      <p role="alert" className="p-8 font-medium text-fail">
        {error}
      </p>
    );
  if (!problem) return <p className="p-8 text-ink/70">Loading problem…</p>;

  return (
    <div className="min-h-screen px-6 py-8">
      <Link
        to="/"
        className="text-sm font-medium text-cobalt underline underline-offset-4"
      >
        All problems
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <section>
          <h1 className="text-3xl font-bold">{problem.title}</h1>
          <p className="mt-1 text-sm font-medium">{problem.difficulty}</p>
          <p className="mt-6 max-w-prose whitespace-pre-wrap leading-relaxed">
            {problem.description}
          </p>
          <HintLadder problemId={problem._id} code={code} />
        </section>

        <section>
          <label htmlFor="editor" className="text-sm font-medium">
            Your solution
          </label>
          <textarea
            id="editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            data-gramm="false"
            className="mt-2 block h-80 w-full resize-y rounded-[3px] border-2 border-ink bg-white p-4 font-mono text-sm leading-relaxed outline-none focus:border-cobalt"
          />

          <button
            onClick={handleRun}
            className="mt-4 rounded-[4px] bg-cobalt px-5 py-2.5 font-semibold text-white active:translate-y-px"
          >
            Run tests
          </button>

          <div aria-live="polite" className="mt-6">
            {report?.error && (
              <p className="font-medium text-fail">{report.error}</p>
            )}

            {report && !report.error && (
              <>
                <p className="font-semibold">
                  {report.results.filter((r) => r.passed).length} of{" "}
                  {report.results.length} tests passed
                </p>
                <ul className="mt-3 border-t border-ink/20">
                  {report.results.map((r, i) => (
                    <li key={i} className="border-b border-ink/20 py-3">
                      <span
                        className={`mr-3 font-semibold ${r.passed ? "text-pass" : "text-fail"}`}
                      >
                        {r.passed ? "Pass" : "Fail"}
                      </span>
                      <code className="font-mono text-sm">
                        {problem.functionName}(
                        {r.args.map((a) => JSON.stringify(a)).join(", ")})
                      </code>
                      {!r.passed && (
                        <p className="mt-1 font-mono text-sm text-ink/80">
                          expected {JSON.stringify(r.expected)}, got{" "}
                          {r.error ?? JSON.stringify(r.actual)}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {submissions.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold">Your attempts</h2>
              <ul className="mt-3 border-t border-ink/20">
                {submissions.map((s) => (
                  <li
                    key={s._id}
                    className="flex items-baseline justify-between border-b border-ink/20 py-3"
                  >
                    <span>
                      <span
                        className={`font-semibold ${s.passedCount === s.totalCount ? "text-pass" : "text-ink"}`}
                      >
                        {s.passedCount} of {s.totalCount} passed
                      </span>
                      <span className="ml-3 text-sm text-ink/70">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                    </span>
                    <button
                      onClick={() => setCode(s.code)}
                      className="text-sm font-medium text-cobalt underline underline-offset-4"
                    >
                      Load code
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
