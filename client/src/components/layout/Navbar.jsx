import { User, LayoutDashboard, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location (URL path)

  const [activeTab, setAsActive] = useState('');

  // Update activeTab based on the current route
  useEffect(() => {
    if (location.pathname === '/moa-dashboard') {
      setAsActive('dashboard');
    } else if (location.pathname === '/moa-monitoring') {
      setAsActive('addMOA');
    } else if (location.pathname === '/moa-monitoring-admin') {
      setAsActive('addAdmin');
    }
  }, [location.pathname]);
  
  const handleAddAdminButtonClick = () => {
    setAsActive('addAdmin');
    navigate("/moa-monitoring-admin");
  };

  const handleAddMOAButtonClick = () => {
    setAsActive('addMOA');
    navigate("/moa-monitoring");
  };

  const handleDashboardButtonClick = () => {
    setAsActive('dashboard');
    navigate("/moa-dashboard");
  };

  return (
    <nav className="w-20 m-3 rounded-lg bg-maroon max-h-screen flex flex-col items-center py-4">
      <div className="mb-8">
        <img src="/PUP.png" alt="PUP Logo" className="w-12 h-12" />
      </div>
      
      <div className="flex flex-col space-y-5 flex-grow justify-center w-full">
        <button 
          className= {`text-white w-full flex items-center justify-center p-4 transition-colors duration-200 ${ activeTab === 'dashboard' ? 'bg-red' : 'hover:bg-red' }`}
          onClick={ handleDashboardButtonClick }
        >
          <LayoutDashboard size={24} />
        </button>
        
        <button 
          className= {`text-white w-full flex items-center justify-center p-4 transition-colors duration-200 ${ activeTab === 'addMOA' ? 'bg-red' : 'hover:bg-red' }`}
          onClick={ handleAddMOAButtonClick }
          >
          <FileText size={24} />
        </button>

        <button 
          className= {`text-white w-full flex items-center justify-center p-4 transition-colors duration-200 ${ activeTab === 'addAdmin' ? 'bg-red' : 'hover:bg-red' }`}
          onClick={ handleAddAdminButtonClick }
        >
          <User size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;