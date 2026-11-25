import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

const levelStyle = { easy: "text-pass", medium: "text-ink", hard: "text-fail" };

export default function Problems() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/problems")
      .then(setProblems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pt-16 pb-24">
      <header className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Problems</h1>
        <p className="text-sm">
          {user.role !== "student" && (
            <>
              <Link
                to="/instructor"
                className="font-medium text-cobalt underline underline-offset-4"
              >
                Doubts
              </Link>{" "}
              ·{" "}
            </>
          )}
          {user.name} ·{" "}
          <button
            onClick={handleLogout}
            className="font-medium text-cobalt underline underline-offset-4"
          >
            Log out
          </button>
        </p>
      </header>

      {loading && <p className="mt-10 text-ink/70">Loading problems…</p>}
      {error && (
        <p role="alert" className="mt-10 font-medium text-fail">
          {error}
        </p>
      )}
      {!loading && !error && problems.length === 0 && (
        <p className="mt-10 text-ink/70">No problems yet. Check back soon.</p>
      )}

      <ul className="mt-8 border-t border-ink/20">
        {problems.map((p) => (
          <li key={p._id} className="border-b border-ink/20">
            <Link
              to={`/problems/${p._id}`}
              className="flex items-baseline justify-between py-4 hover:bg-ink/5"
            >
              <span className="text-lg font-medium">{p.title}</span>
              <span
                className={`text-sm font-medium ${levelStyle[p.difficulty]}`}
              >
                {p.difficulty}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
