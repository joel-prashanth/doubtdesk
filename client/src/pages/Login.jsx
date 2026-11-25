import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-6 pt-24">
      <h1 className="text-3xl font-bold">Log in</h1>
      <p className="mt-2 text-ink/70">Pick up your problems where you left them.</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-[3px] border-b-2 border-ink bg-transparent px-1 py-2 outline-none focus:border-cobalt"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-[3px] border-b-2 border-ink bg-transparent px-1 py-2 outline-none focus:border-cobalt"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-fail">
            {error}
          </p>
        )}

        <button
          disabled={busy}
          className="rounded-[4px] bg-cobalt px-5 py-2.5 font-semibold text-white active:translate-y-px disabled:opacity-60"
        >
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-8 text-sm">
        New here?{" "}
        <Link to="/register" className="font-medium text-cobalt underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </main>
  );
}