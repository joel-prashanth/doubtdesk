import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import ProblemPage from "./pages/ProblemPage";
import InstructorDashboard from "./pages/InstructorDashboard";

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
            <Problems />
          </Protected>
        }
      />
      <Route
        path="/problems/:id"
        element={
          <Protected>
            <ProblemPage />
          </Protected>
        }
      />
      <Route
        path="/instructor"
        element={
          <Protected>
            <InstructorDashboard />
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
