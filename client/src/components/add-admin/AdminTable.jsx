import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminTable() {
  const [users, setUsers] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/auth/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
  
        const data = await response.json();
        if (Array.isArray(data.users)) {
          setUsers(data.users); // Set the users state
        } else {
          throw new Error("API response is not valid: 'users' is not an array");
        }
      } catch (error) {
        toast.error(`Failed to load users: ${error.message}`, {
          position: "top-right",
        });
      } finally {
        setLoading(false); // Always stop loading spinner
      }
    };
  
    fetchUsers();
  }, []);
  

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <ToastContainer />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light-gray">
            <AdminHeader />
          </thead>
          <tbody>
            {users?.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4 text-sm text-gray-900">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="p-4 text-sm text-gray-900">{user.email}</td>
                  <td className="p-4 text-sm text-gray-900">
                    {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
