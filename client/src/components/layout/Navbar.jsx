// src/components/Navbar.jsx
import { User, LayoutDashboard, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfilePopover from "./ProfilePopover";
import InitialsAvatar from "./InitialsAvatar";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setAsActive] = useState('');

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    role: "",
  });

  const roleStyles = {
    "Super Admin": "bg-purple-700",
    "Employment Admin": "bg-blue-700",
    "Practicum Admin": "bg-green-700",
    "Research Admin": "bg-gray-500",
  };

  useEffect(() => {
    if (location.pathname === "/moa-dashboard") {
      setAsActive("dashboard");
    } else if (location.pathname === "/moa-monitoring") {
      setAsActive("addMOA");
    } else if (location.pathname === "/moa-monitoring-admin") {
      setAsActive("addAdmin");
    }
  }, [location.pathname]);

  // Retrieve user data from localStorage
  useEffect(() => {
    const firstname = localStorage.getItem("firstname") || "User";
    const lastname = localStorage.getItem("lastname") || "";
    const role = localStorage.getItem("role") || "Guest";
    setUser({ firstname, lastname, role });
  }, []);

  const handleToggleProfile = () => {
    if (!showProfile) {
      setShowProfile(true);
    }
  };

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

      <div className="relative w-full flex items-center justify-center mt-auto">
        <button
          className={`w-full flex items-center justify-center p-4 transition-colors duration-200 ${
            showProfile ? "pointer-events-none opacity-50" : "hover:bg-red"
          }`}
          onClick={handleToggleProfile}
          disabled={showProfile}
        >
          <InitialsAvatar
            firstname={user.firstname}
            lastname={user.lastname}
            role={user.role}
            roleStyles={roleStyles}
          />
        </button>

        <ProfilePopover show={showProfile} onClose={() => setShowProfile(false)} />
      </div>
    </nav>
  );
};

export default Navbar;
