import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Search, RefreshCw, X, Edit2 } from "lucide-react";
import Modal from "../layout/Modal";
import MOAHeader from "./MOAHeader";
import AddMOAModal from "./AddMOAModal";

export default function MOATable({ isModalOpen, setIsModalOpen }) {
  const [moas, setMoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    moa: null,
    isDeleting: false
  });

  const fetchMOAs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/moas");
      if (!response.ok) {
        throw new Error("Failed to fetch MOAs");
      }
      const data = await response.json();
  
      // Log the fetched data to the console
      console.log("Fetched MOAs:", data);
  
      // Access the moas array from the response
      const moasData = data.moas || [];  // In case the moas property is missing, fallback to an empty array
      console.assert(Array.isArray(moasData), "Fetched data is not an array");
      setMoas(moasData);
    } catch (error) {
      console.error("Fetch MOAs error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMOAs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMOAs();
  };

  const handleDelete = async (moaId) => {
    if (!moaId) {
      toast.error("Invalid MOA ID");
      return;
    }

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      const response = await fetch(`/api/moas/${moaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete MOA");
      }

      setMoas(prev => prev.filter(moa => moa.id !== moaId));
      toast.success("MOA deleted successfully");
      setDeleteModal({ isOpen: false, moa: null, isDeleting: false });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message);
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Get unique types and statuses for filters
  const types = Array.isArray(moas) ? [...new Set(moas.map(moa => moa.type))] : [];
  const statuses = Array.isArray(moas) ? [...new Set(moas.map(moa => moa.status))] : [];

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatus([]);
    setSearchTerm("");
  };

  const filteredMOAs = Array.isArray(moas) ? moas.filter(moa => {
    // Convert all relevant fields to lowercase for case-insensitive comparison
    const matchesSearch = (
      moa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moa.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moa.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Check for type and status filters
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(moa.type);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(moa.status);
  
    return matchesSearch && matchesType && matchesStatus;
  }) : [];  

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-8 h-8 border-4 border-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading MOAs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <ToastContainer />

      {/* Search, Filter and Refresh Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search MOAs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-maroon focus:border-maroon outline-none"
              />
            </div>
            
            {/* Type Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedTypes.includes(type)
                      ? "bg-maroon/10 text-maroon hover:bg-maroon/20"
                      : "bg-light-gray text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedStatus.includes(status)
                      ? "bg-maroon/10 text-maroon hover:bg-maroon/20"
                      : "bg-light-gray text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {(selectedTypes.length > 0 || selectedStatus.length > 0 || searchTerm) && (
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
        {(selectedTypes.length > 0 || selectedStatus.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Active filters:</span>
            {selectedTypes.map(type => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2 py-1 bg-maroon/5 text-maroon rounded-full"
              >
                {type}
                <button
                  onClick={() => toggleType(type)}
                  className="hover:text-red"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedStatus.map(status => (
              <span
                key={status}
                className="inline-flex items-center gap-1 px-2 py-1 bg-maroon/5 text-maroon rounded-full"
              >
                {status}
                <button
                  onClick={() => toggleStatus(status)}
                  className="hover:text-red"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* MOAs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <MOAHeader />
          </thead>
          <tbody>
            {Array.isArray(filteredMOAs) && filteredMOAs.length > 0 ? (
              filteredMOAs.map((moa, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </td>
                  <td className="p-4 text-sm text-gray-900">{moa.name}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.type_of_moa}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.nature_of_business}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.contact_person || "N/A"}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.contact_number}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.email}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      moa.moa_status === 'Active' ? 'bg-green-100 text-green-800' :
                      moa.moa_status === 'Expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {moa.moa_status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-900">{moa.years_validity}</td>
                  <td className="p-4 text-sm text-gray-900">{new Date(moa.date_notarized).toLocaleDateString()}</td>
                  <td className="p-4 text-sm text-gray-900">{new Date(moa.expiry_date).toLocaleDateString()}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.year_submitted}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {/* Handle edit */}}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit MOA"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, moa, isDeleting: false })}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete MOA"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="p-8 text-center text-gray-500">
                  {searchTerm || selectedTypes.length > 0 || selectedStatus.length > 0 ? (
                    <>
                      <p className="text-lg font-medium">No matching MOAs found</p>
                      <p className="text-sm mt-1">Try adjusting your search terms or filters</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium">No MOAs found</p>
                      <p className="text-sm mt-1">Add some MOAs to get started</p>
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
        onClose={() => !deleteModal.isDeleting && setDeleteModal({ isOpen: false, moa: null, isDeleting: false })}
        title="Delete MOA"
      >
        <div className="p-4">
          <p className="text-gray-600">
            Are you sure you want to delete the MOA with{" "}
            <span className="font-medium text-gray-900">
              {deleteModal.moa?.name}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4">
          <button
            onClick={() => setDeleteModal({ isOpen: false, moa: null, isDeleting: false })}
            disabled={deleteModal.isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteModal.moa?.id)}
            disabled={deleteModal.isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-maroon hover:bg-red-600 disabled:bg-red-300 rounded-md transition-colors flex items-center gap-2"
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

      <AddMOAModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMOAAdded={() => {
          fetchMOAs();
          toast.success("MOA added successfully");
        }}
      />
    </div>
  );
}
