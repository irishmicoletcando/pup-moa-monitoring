import { useNavigate } from "react-router-dom";

export default function DashboardButton() {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate("/moa-dashboard")}
      className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#A41313] rounded-full
                 hover:bg-[#A41313] transform hover:scale-105 transition-all duration-200 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon"
      style={{
        boxShadow: '0 6px 8px -3px rgba(0, 0, 0, 0.5), 0 12px 15px -4px rgba(24, 24, 24, 0.7)',
      }}
    >
      Dashboard
    </button>
  );  
};  