import { User, LayoutDashboard, FileText, Info } from "lucide-react";
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

  useEffect(() => {
    const firstname = localStorage.getItem("firstname") || "User";
    const lastname = localStorage.getItem("lastname") || "";
    const role = localStorage.getItem("role") || "Guest";
    setUser({ firstname, lastname, role });
  }, []);

  const handleToggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleNavigation = (route, tab) => {
    setAsActive(tab);
    navigate(route);
  };

  const handleLanding = () => {
    navigate("/landing-page");
  };

  const navItems = [
    {
      icon: <LayoutDashboard size={24} />,
      label: "Dashboard",
      route: "/moa-dashboard",
      tab: "dashboard"
    },
    {
      icon: <FileText size={24} />,
      label: "MOA",
      route: "/moa-monitoring",
      tab: "addMOA"
    },
    {
      icon: <User size={24} />,
      label: "Admin",
      route: "/moa-monitoring-admin",
      tab: "addAdmin"
    },
    {
      icon: <Info size={24} />,
      label: "About",
      route: "/moa-monitoring-about",
      tab: "about"
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-28 bg-maroon max-h-screen flex-col items-center py-4">
        <div className="mb-8">
          <img src="/PUP.png" alt="PUP Logo" className="w-12 h-12 cursor-pointer" onClick = {handleLanding}/>
        </div>

        <div className="flex flex-col flex-grow justify-center w-full">
          {navItems.map((item) => (
            <button
              key={item.tab}
              className={`text-white w-full flex flex-col items-center justify-center px-4 py-6 transition-colors duration-200 ${
                activeTab === item.tab ? 'bg-red' : 'hover:bg-red'
              }`}
              onClick={() => handleNavigation(item.route, item.tab)}
            >

              <div className={``}> 
                {item.icon}
              </div>
              <div className={`text-xs`}> 
                {item.label}
              </div>
            </button>
          ))}
        </div>

        <div className="relative w-full flex items-center justify-center mt-auto">
          <button
            className="w-full flex items-center justify-center p-4 transition-colors duration-200 hover:bg-red"
            onClick={handleToggleProfile}
          >
            <InitialsAvatar
              firstname={user.firstname}
              lastname={user.lastname}
              role={user.role}
              roleStyles={roleStyles}
            />
          </button>
          
          <ProfilePopover 
            show={showProfile} 
            onClose={() => setShowProfile(false)} 
          />
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-maroon text-white z-10">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.tab}
              className={`flex flex-col items-center justify-center px-2 py-4 flex-1 ${
                activeTab === item.tab ? 'bg-red' : 'hover:bg-red'
              }`}
              onClick={() => handleNavigation(item.route, item.tab)}
            >
              <div className="mb-1">{item.icon}</div>
              {/* <span className="text-xs">{item.label}</span> */}
            </button>
          ))}
          <button
            className="flex flex-col items-center justify-center p-2 flex-1"
            onClick={handleToggleProfile}
          >
            <div className="mb-1">
              <InitialsAvatar
                firstname={user.firstname}
                lastname={user.lastname}
                role={user.role}
                roleStyles={roleStyles}
                size="small"
              />
            </div>
            {/* <span className="text-xs">Profile</span> */}
          </button>
        </div>
      </nav>

      {/* Render ProfilePopover for mobile */}
      <div className="md:hidden">
        <ProfilePopover 
          show={showProfile} 
          onClose={() => setShowProfile(false)} 
        />
      </div>
    </>
  );
};

export default Navbar;