import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pt-24">
      <h1 className="text-3xl font-bold">Hi, {user.name}</h1>
      <p className="mt-2 text-ink/70">You're logged in as {user.role}.</p>
      <button
        onClick={handleLogout}
        className="mt-6 text-sm font-medium text-cobalt underline underline-offset-4"
      >
        Log out
      </button>
    </main>
  );
}

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected>
            <Home />
          </Protected>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />
    </Routes>
  );
}
