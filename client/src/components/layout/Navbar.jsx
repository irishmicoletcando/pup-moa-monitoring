import { User, LayoutDashboard, FileText } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleAddAdminButtonClick = () => {
    navigate("/add-admin");
  };

  const handleAddMOAButtonClick = () => {
    navigate("/moa-monitoring");
  };

  const handleDashboardButtonClick = () => {
    navigate("/moa-dashboard");
  };

  return (
    <nav className="w-20 m-3 rounded-lg bg-maroon max-h-screen flex flex-col items-center py-4">
      <div className="mb-8">
        <img src="/PUP.png" alt="PUP Logo" className="w-12 h-12" />
      </div>
      
      <div className="flex flex-col space-y-5 flex-grow justify-center w-full">
        <button className="text-white hover:bg-red w-full flex items-center justify-center p-4 transition-colors duration-200"
          onClick={handleDashboardButtonClick}>
          <LayoutDashboard size={24} />
        </button>
        
        <button className="text-white hover:bg-red w-full flex items-center justify-center p-4 transition-colors duration-200"
          onClick={handleAddMOAButtonClick}>
          <FileText size={24} />
        </button>

        <button 
          className="text-white hover:bg-red w-full flex items-center justify-center p-4 transition-colors duration-200"
          onClick={handleAddAdminButtonClick}
        >
          <User size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;