import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Get token from localStorage

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (location.pathname === "/") {
    return <Navigate to="/moa-dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;