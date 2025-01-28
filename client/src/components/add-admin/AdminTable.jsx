import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Search, RefreshCw } from "lucide-react";
import Modal from "../layout/Modal";

export default function AdminTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeDeleteModal();
      }
    };

    if (deleteModal.isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [deleteModal.isOpen]);

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
      toast.error(`Failed to load users: ${error.message}`, {
        position: "top-right",
      });
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
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleDelete = async () => {
    const userId = deleteModal.user.id;
    setDeleting(userId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      setUsers(users.filter((user) => user.id !== userId));
      toast.success("Admin deleted successfully", {
        position: "top-right",
      });
      closeDeleteModal();
    } catch (error) {
      toast.error(`Failed to delete admin: ${error.message}`, {
        position: "top-right",
      });
    } finally {
      setDeleting(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <AdminHeader />
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
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
                      disabled={deleting === user.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete admin"
                    >
                      {deleting === user.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
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

      <Modal isOpen={deleteModal.isOpen} onClose={closeDeleteModal} title="Delete Admin User">
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting !== null}
            className="px-4 py-2 text-sm font-medium text-white bg-red hover:bg-maroon hover:bg-red-600 disabled:bg-red-300 rounded-md transition-colors flex items-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}