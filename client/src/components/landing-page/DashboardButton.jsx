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
        className="bg-[#800000] text-white rounded-3xl shadow-lg shadow-[#800000]/40 py-3 px-6 text-base md:py-4 md:px-8 md:text-lg lg:py-4 lg:px-10">
        Dashboard
      </button>
    </div>
  );
}
