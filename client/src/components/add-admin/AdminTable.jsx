import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Search, RefreshCw } from "lucide-react";
import Modal from "../layout/Modal";

export default function AdminTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    user: null,
    isDeleting: false 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !deleteModal.isDeleting) {
        closeDeleteModal();
      }
    };

    if (deleteModal.isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [deleteModal.isOpen, deleteModal.isDeleting]);

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
        setUsers(data.users);
      } else {
        throw new Error("API response is not valid: 'users' is not an array");
      }
    } catch (error) {
      toast.error(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user, isDeleting: false });
  };

  const closeDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({ isOpen: false, user: null, isDeleting: false });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user?.user_id) {
      toast.error("Invalid user ID");
      return;
    }
  
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/auth/delete-user/${deleteModal.user.user_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
  
      // First check if the response is ok
      if (!response.ok) {
        let errorMessage = 'Failed to delete user';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
  
      // Try to parse the response, but don't fail if it's empty
      let message = 'User deleted successfully';
      try {
        const data = await response.json();
        message = data.message || message;
      } catch (e) {
        // If JSON parsing fails, use the default message
        console.log('No JSON response, using default success message', e);
      }
  
      // Update UI and show success message
      setUsers(prev => prev.filter(user => user.user_id !== deleteModal.user.user_id));
      toast.success(message);
      setDeleteModal({ isOpen: false, user: null, isDeleting: false });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <ToastContainer />
      {/* Search and Refresh Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <AdminHeader />
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-900">
                    <div className="font-medium">
                      {user.firstname} {user.lastname}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.email}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {user.last_login ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        {new Date(user.last_login).toLocaleString()}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        Never
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete admin"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  {searchTerm ? (
                    <>
                      <p className="text-lg font-medium">No matching users found</p>
                      <p className="text-sm mt-1">Try adjusting your search terms</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm mt-1">Add some users to get started</p>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal 
        isOpen={deleteModal.isOpen} 
        onClose={closeDeleteModal} 
        title="Delete Admin"
      >
        <div className="p-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {deleteModal.user?.firstname} {deleteModal.user?.lastname}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4">
          <button
            onClick={closeDeleteModal}
            disabled={deleteModal.isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteModal.isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red hover:bg-maroon hover:bg-red-600 disabled:bg-red-300 rounded-md transition-colors flex items-center gap-2"
          >
            {deleteModal.isDeleting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}