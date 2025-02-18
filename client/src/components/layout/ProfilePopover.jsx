import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InitialsAvatar from "./InitialsAvatar";

const ProfilePopover = ({ show, onClose }) => {
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  const roleStyles = {
    'Super Admin': 'bg-purple-700',
    'Employment Admin': 'bg-blue-700',
    'Practicum Admin': 'bg-green-700',
    'Research Admin': 'bg-gray-500',
  };

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    role: "",
  });

  useEffect(() => {
    const firstname = localStorage.getItem("firstname") || "User";
    const lastname = localStorage.getItem("lastname") || "";
    const role = localStorage.getItem("role") || "Guest";
    setUser({ firstname, lastname, role });
  }, []);

  const handleUserLogout = () => {
    try {
      localStorage.clear(); // Clear all stored user data
      localStorage.setItem("logout-event", Date.now()); // Notify other tabs
      toast.success("Logout successful! Redirecting...", { position: "top-right" });
  
      setTimeout(() => navigate("/"), 1000); // Redirect to login
    } catch (err) {
      toast.error(err.message, { position: "top-right" });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target) && 
        !event.target.closest("#logout-button") // Prevent closing when clicking logout
      ) {
        onClose();
      }
    };
  
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose}
      />

      {/* Popover */}
      <div 
        ref={popoverRef}
        className={`
          fixed
          z-50
          md:absolute
          inset-x-0
          mx-auto
          bottom-20
          md:bottom-0
          md:left-full
          md:mx-0
          md:ml-2
          w-[90%]
          max-w-sm
          md:w-80
          bg-white 
          shadow-xl 
          rounded-lg
          flex 
          flex-col 
          items-center
          text-black
          transition-all 
          duration-200 
          ease-out
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* Arrow for desktop only */}
        <div className="hidden md:block absolute right-full bottom-4 -ml-2 -translate-y-1/2 w-0 h-0 border-y-8 border-l-8 border-l-maroon border-y-transparent" />

        <div className="w-full flex items-center justify-center rounded-t-lg py-3 bg-gray-100">
          <InitialsAvatar 
            firstname={user.firstname}
            lastname={user.lastname}
            role={user.role}
            roleStyles={roleStyles}
            size="default"
          />
        </div>

        <span className="font-semibold mt-3 text-lg">{user.firstname} {user.lastname}</span>
        <span className="text-sm text-gray-500 mt-1 mb-6">{user.role}</span>

        <button
          id="logout-button"
          className="group flex items-center space-x-2 mb-4 w-full justify-center py-2 rounded-md transition-all duration-200 text-black hover:text-red"
          onClick={handleUserLogout}
        >
          <LogOut size={20} className="transition-all duration-200 group-hover:text-red" />
          <span className="transition-all duration-150 group-hover:text-red">Logout</span>
        </button>
      </div>
    </>
  );
};

export default ProfilePopover;