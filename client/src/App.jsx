import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./components/add-admin/AddAdminModal";
import MOA from "./pages/MOA";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import { useMoaFilterContext, MoaFilterProvider } from "./components/context/MoaFilterContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  return (
    <MoaFilterProvider>
      <Router>
        <AppRoutes />
      </Router>
    </MoaFilterProvider>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      if (localStorage.getItem("token")) {
        navigate("/moa-dashboard"); // Prevent back navigation to login
      } else {
        navigate("/"); // If no token, go back to login
      }
    };
    
    const handleStorageChange = (event) => {
      if (event.key === "logout-event") {
        navigate("/"); // Redirect to login if another tab logs out
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/moa-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/moa-monitoring" element={<ProtectedRoute><MOA /></ProtectedRoute>} />
      <Route path="/moa-monitoring-admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/add-admin" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />
    </Routes>
  );
}