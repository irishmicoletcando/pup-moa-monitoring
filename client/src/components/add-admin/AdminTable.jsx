import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Search, RefreshCw, X } from "lucide-react";
import Modal from "../layout/Modal";
import RoleBadge from "../layout/RoleBadge";
import AdminModal from "./AddAdminModal";

export default function AdminTable({ isModalOpen, setIsModalOpen, refreshTrigger, setRefreshTrigger  }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    user: null,
    isDeleting: false 
  });

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
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Show loading spinner immediately when fetching
    fetchUsers();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes (after adding new admin)
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleUserAdded = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger a refresh
    setLoading(true); // Show the loading spinner while fetching users
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

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(prev => prev.filter(user => user.user_id !== deleteModal.user.user_id));
      toast.success("User deleted successfully");
      closeDeleteModal();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message);
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const roles = ["Super Admin", "Employment Admin", "Practicum Admin", "Research Admin"];

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const clearFilters = () => {
    setSelectedRoles([]);
    setSearchTerm("");
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(user.role);
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-8 h-8 border-4 border-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <ToastContainer />

      {/* Search, Filter and Refresh Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search and Role Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-maroon focus:border-maroon outline-none"
              />
            </div>
            
            {/* Role Filter Buttons */}
            <div className="flex flex-wrap gap-4">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedRoles.includes(role)
                      ? "bg-maroon/10 text-maroon hover:bg-maroon/20"
                      : "bg-light-gray text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {(selectedRoles.length > 0 || searchTerm) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-maroon hover:bg-light-gray rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
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
        
        {/* Active Filters Summary */}
        {selectedRoles.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Active filters:</span>
            {selectedRoles.map(role => (
              <span
                key={role}
                className="inline-flex items-center gap-1 px-2 py-1 bg-maroon/5 text-maroon rounded-full"
              >
                {role}
                <button
                  onClick={() => toggleRole(role)}
                  className="hover:text-red"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
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
                  <td className="p-4 text-sm text-gray-600">
                    <div className="truncate max-w-md" title={user.email}>
                      {user.email}
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    <RoleBadge role={user.role} />
                  </td>
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
            className="px-4 py-2 text-sm font-medium text-white bg-maroon hover:bg-red hover:bg-red-600 disabled:bg-red-300 rounded-md transition-colors flex items-center gap-2"
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
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}