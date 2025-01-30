import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./components/add-admin/AddAdminModal";
import MOA from "./pages/MOA";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/moa-homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/moa-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/moa-monitoring" element={<ProtectedRoute><MOA /></ProtectedRoute>} />
        <Route path="/moa-monitoring-admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/add-admin" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}