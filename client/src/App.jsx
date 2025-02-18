import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./components/add-admin/AddAdminModal";
import MOA from "./pages/MOA";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import { jwtDecode } from "jwt-decode";
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
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      console.log("Checking token validity...");

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const expiryTime = new Date(decodedToken.exp * 1000); // Convert expiry timestamp to milliseconds
          const currentTime = new Date(); // Current time
          
          // console.log('Token expiry time:', expiryTime);
          // console.log('Current time:', currentTime);
          // console.log('Difference (in seconds):', (expiryTime - currentTime) / 1000);

          if (expiryTime < currentTime) {
            console.log("Token expired. Logging out...");
            localStorage.removeItem("token");
            localStorage.removeItem("firstname");
            localStorage.removeItem("lastname");
            localStorage.removeItem("role");
            localStorage.removeItem("user_id");
            localStorage.removeItem("userEmail");

            localStorage.setItem("logout-event", Date.now()); // Notify other tabs
            navigate("/"); // Redirect to login page
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    };

    checkTokenValidity(); // Run immediately on page load

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      if (localStorage.getItem("token")) {
        navigate("/moa-dashboard");
      } else {
        navigate("/");
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === "logout-event") {
        navigate("/");
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