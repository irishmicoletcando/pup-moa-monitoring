import { useNavigate } from "react-router-dom";

export default function DashboardButton() {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate("/moa-dashboard")}
      className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#800000] rounded-full shadow-lg hover:bg-[#900000] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
    >
      Go to Dashboard
    </button>
  );
}