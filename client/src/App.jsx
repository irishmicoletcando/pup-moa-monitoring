import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./components/add-admin/AddAdminModal";
import MOA from "./pages/MOA";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/moa-dashboard" element={<Dashboard />} />
        <Route path="/moa-monitoring" element={<MOA />} />
        <Route path="/moa-monitoring-admin" element={<Admin />} />
        <Route path="/add-admin" element={<AddAdmin />} />
      </Routes>
    </Router>
  );
}