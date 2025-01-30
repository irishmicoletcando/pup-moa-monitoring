import { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfilePopover = ({ show, onClose }) => {
  const navigate = useNavigate();
  const popoverRef = useRef(null); // Reference for popover div

  const handleUserLogout = () => {
    // TODO: Add logout logic here
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
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

  if (!show) return null; // Don't render if not visible

  return (
    <div 
      ref={popoverRef}
      className={`absolute left-full ml-2 w-40 bg-white shadow-md rounded-lg p-3 flex flex-col items-center text-black transition-all duration-200 ease-out transform ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-95"
    }`}>

    <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-0 h-0 border-y-8 border-l-8 border-l-maroon border-y-transparent"></div>

    <span className="font-semibold">Admin</span>
    <button 
      className="text-red-600 hover:text-red-800 flex items-center space-x-2 mt-2"
      onClick={handleUserLogout}
    >
      <LogOut size={20} />
      <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfilePopover;
