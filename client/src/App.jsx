import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./components/add-admin/AddAdminModal";
import MOA from "./pages/MOA";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import { useMoaFilterContext, MoaFilterProvider } from "./components/context/MoaFilterContext";

export default function App() {
  return (
    <MoaFilterProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/moa-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/moa-monitoring" element={<ProtectedRoute><MOA /></ProtectedRoute>} />
          <Route path="/moa-monitoring-admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/add-admin" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />
        </Routes>
      </Router>
    </MoaFilterProvider>
  );
}