import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfilePopover = ({ show, onClose }) => {
  const navigate = useNavigate();
  const popoverRef = useRef(null); // Reference for popover div

  const roleStyles = {
    'Super Admin': 'bg-purple-500',
    'Employment Admin': 'bg-blue-500',
    'Practicum Admin': 'bg-green-500',
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

  // Generate initials for avatar
  const getInitials = (firstname, lastname) => {
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const handleUserLogout = () => {
    try {
      localStorage.removeItem("token"); // Remove JWT token
      localStorage.removeItem("firstname"); // Remove firstname
      localStorage.removeItem("lastname"); // Remove lastname
      localStorage.removeItem("role"); // Remove role
      localStorage.removeItem("user_id"); // Remove user ID
      localStorage.removeItem("userEmail"); // Remove email

      toast.success("Logout successful! Redirecting...", { position: "top-right" });
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err.message, { position: "top-right" });
    }
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
      className={`absolute left-full ml-2 w-48 bg-gray-100 shadow-md rounded-lg p-3 flex flex-col items-center text-black transition-all duration-200 ease-out transform ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >

      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-0 h-0 border-y-8 border-l-8 border-l-maroon border-y-transparent"></div>

      <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-lg font-bold ${
        roleStyles[user.role] || "bg-gray-500"
      }`}>
        {getInitials(user.firstname, user.lastname)}
      </div>

      <span className="font-semibold mt-2">{user.firstname} {user.lastname}</span>
      <span className="text-sm text-gray-500">{user.role}</span>

      <button 
        className="text-red-600 hover:text-red-800 flex items-center space-x-2 mt-3"
        onClick={handleUserLogout}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfilePopover;
