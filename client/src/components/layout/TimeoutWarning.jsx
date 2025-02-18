import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const TimeoutWarning = ({ isVisible, onExtendSession, onClose }) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleUserLogout = () => {
    try {
      localStorage.clear(); // Clear all stored user data
      localStorage.setItem("logout-event", Date.now()); // Notify other tabs
      toast.success("Logout successful! Redirecting...", { position: "top-right" });

      onClose(); 
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.message, { position: "top-right" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 z-50">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="text-red-600" size={24} /> 
          <h2 className="text-lg font-semibold">Session Expiring</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Your session is about to expire. Do you want to extend it?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={handleUserLogout}
          >
            Logout
          </button>
          <button
            className="px-4 py-2 bg-maroon text-white rounded hover:bg-red"
            onClick={onExtendSession}
          >
            Extend Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeoutWarning;
