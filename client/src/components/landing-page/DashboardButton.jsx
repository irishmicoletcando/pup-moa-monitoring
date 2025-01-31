import { useNavigate } from "react-router-dom";

export default function DashboardButton() {
  const navigate = useNavigate();

  const handleDashboardButtonClick = () => {
    navigate("/moa-dashboard");
  };

  return (
    <div>
      <button 
        onClick={handleDashboardButtonClick} 
        className="bg-[#800000] text-white rounded-3xl shadow-lg shadow-[#800000]/40 py-4 px-10 text-lg">
        Dashboard
      </button>
    </div>
  );
}
