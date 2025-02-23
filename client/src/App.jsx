import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./components/add-admin/AddAdminModal";
import MOA from "./pages/MOA";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import TimeoutWarning from "./components/layout/TimeoutWarning";
import { jwtDecode } from "jwt-decode";
import { useMoaFilterContext, MoaFilterProvider } from "./components/context/MoaFilterContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function App() {
  return (
    <MoaFilterProvider>
      <Router>
        <AppRoutes />
      </Router>
    </MoaFilterProvider>
  );
}

let logoutTimeout, warningTimeout; // Declare timeouts globally

function AppRoutes() {
    const navigate = useNavigate();
    const [isWarningShown, setIsWarningShown] = useState(false);

    const setupTokenCheck = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const expiryTime = decodedToken.exp * 1000; 
            const currentTime = Date.now();
            const warningTime = expiryTime - 5 * 60 * 1000; // Show warning 5 mins before expiry
            // const warningTime = expiryTime - 5 * 1000; // Show warning 5 secs before expiry [DEBUGGING]

            // console.log("Token expires at:", new Date(expiryTime));
            // console.log("Warning will show at:", new Date(warningTime)); // [DEBUGGING]

            if (currentTime >= warningTime && currentTime < expiryTime) {
                console.log("User opened site during warning period. Auto-extending session...");
                clearTimeout(warningTimeout);
                setIsWarningShown(false);
                await handleExtendSession(); 
                return;
            }

            if (currentTime >= expiryTime) {
                console.log("Token expired. Logging out...");
                localStorage.clear();
                setIsWarningShown(false);
                navigate("/");
                return;
            }

            // Clear any existing timeouts
            clearTimeout(logoutTimeout);
            clearTimeout(warningTimeout);

            // Show warning 5 min before expiry
            warningTimeout = setTimeout(() => {
                setIsWarningShown(true);
                // console.log("Session warning shown!");
            }, warningTime - currentTime);

            // Auto logout when token expires
            logoutTimeout = setTimeout(() => {
                // console.log("Token expired. Logging out...");
                localStorage.clear();
                setIsWarningShown(false);
                navigate("/");
            }, expiryTime - currentTime);
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.clear();
            setIsWarningShown(false);
            navigate("/");
        }
    };
    useEffect(() => {
        const handleTabFocus = () => {
            // console.log("Tab focused. Rechecking token..."); 
            setupTokenCheck();
        };
    
        const handleStorageChange = (event) => {
            if (event.key === "token") {
                // console.log("Token changed in another tab. Rechecking...");
                setupTokenCheck();
            }
        };
    
        window.addEventListener("visibilitychange", handleTabFocus);
        window.addEventListener("storage", handleStorageChange);
    
        setupTokenCheck(); // Run token validation when component mounts
    
        return () => {
            window.removeEventListener("visibilitychange", handleTabFocus);
            window.removeEventListener("storage", handleStorageChange);
            clearTimeout(logoutTimeout);
            clearTimeout(warningTimeout);
        };
    }, [navigate]);

    const handleExtendSession = async () => {
        try {
            const token = localStorage.getItem("token");
            // console.log("Attempting to renew token with:", token);

            const response = await axios.post("/api/auth/renew-token", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newToken = response.data.token;
            console.log("New token received:", newToken);

            localStorage.setItem("token", newToken);
            setIsWarningShown(false);

            // Clear old timeouts and reset the checks
            clearTimeout(logoutTimeout);
            clearTimeout(warningTimeout);
            setupTokenCheck();
            // console.log("Session extended successfully!");
        } catch (error) {
            console.error("Failed to extend session:", error);
            localStorage.clear();
            navigate("/");
        }
    };

    return (
        <>
            <TimeoutWarning 
                isVisible={isWarningShown} 
                onExtendSession={handleExtendSession} 
                onClose={() => setIsWarningShown(false)} 
            />

            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/landing-page" element={<LandingPage />} />
                <Route path="/moa-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/moa-monitoring" element={<ProtectedRoute><MOA /></ProtectedRoute>} />
                <Route path="/moa-monitoring-admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/add-admin" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />
                <Route path="/moa-monitoring-about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            </Routes>
        </>
    );
}