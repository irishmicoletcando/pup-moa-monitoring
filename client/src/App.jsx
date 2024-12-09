import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./components/profile/AddAdmin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/moa-monitoring" element={<Dashboard />} />
        <Route path="/add-admin" element={<AddAdmin />} />
      </Routes>
    </Router>
  );
}