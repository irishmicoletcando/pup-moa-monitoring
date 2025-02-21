import { useNavigate } from "react-router-dom";

export default function DashboardButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/moa-dashboard");
  };


  return (
    <button 
      onClick={handleClick}
      className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 
                text-base sm:text-lg font-medium text-white bg-[#A41313] rounded-full
                transition-all duration-200 ease-in-out
                hover:bg-[#8a1010] hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A41313]
                shadow-lg hover:shadow-xl active:scale-95"
    >
      Dashboard
    </button>
  );  
};  