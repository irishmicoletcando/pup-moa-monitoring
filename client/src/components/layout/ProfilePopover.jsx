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
      localStorage.removeItem("token");
      localStorage.removeItem("firstname");
      localStorage.removeItem("lastname");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      localStorage.removeItem("userEmail");

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
      className={`absolute bottom-0 left-full ml-2 w-60 bg-white shadow-xl rounded-lg px-0 pb-5 flex flex-col items-center text-black transition-all duration-200 ease-out transform ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* Triangle Pointer */}
      {/* <div className="absolute right-full top-1/1 -translate-y-1/2 w-0 h-0 border-y-8 border-r-8 border-r-maroon border-y-transparent"></div> */}

      <div className="w-full flex items-center justify-center rounded-t-lg py-3 bg-gray-100 mt-0">
        <InitialsAvatar 
            firstname={user.firstname}
            lastname={user.lastname}
            role={user.role}
            roleStyles={roleStyles}
        />
      </div>

      <span className="font-semibold mt-3 text-lg">{user.firstname} {user.lastname}</span>
      <span className="text-sm text-gray-500 mt-1 mb-28">{user.role}</span>

      <button
        className="group flex items-center space-x-2 mt-2 w-full justify-center py-2 rounded-md transition-all duration-200 text-black hover:text-red"
        onClick={handleUserLogout}
      >
        <LogOut size={20} className="transition-all duration-200 group-hover:text-red" />
        <span className="transition-all duration-150 group-hover:text-red">Logout</span>
      </button>
    </div>
  );
};

export default ProfilePopover;
