import { useState, useEffect, useMemo, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Search, RefreshCw, X, Edit2, FileText, FilterX } from "lucide-react";
import Modal from "../layout/Modal";
import MOAHeader from "./MOAHeader";
import AddMOAModal from "./AddMOAModal";
import ExportExcelModal from "./ExportExcelModal";
import ImportExcelModal from "./ImportExcelModal";
import EditMOAModal from "./EditMOAModal";
import ViewMOAModal from "./ViewMOAModal";
import { useMoaFilterContext } from "../context/MoaFilterContext";

export default function MOATable({ isModalOpen, setIsModalOpen, isExportExcelModalOpen, setIsExportExcelModalOpen, isImportExcelModalOpen, setIsImportExcelModalOpen, selectedRows, setSelectedRows }) {
  const [moas, setMoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMOA, setSelectedMOA] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: 'asc'
  });

  const { moaFilters, onMoaFilterChange, clearFilters } = useMoaFilterContext();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    moa: null,
    isDeleting: false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedMOAs, setPaginatedMOAs] = useState([]);

  // Fetch MOAs when component mounts
  useEffect(() => {
    fetchMOAs();
  }, []);

  const fetchMOAs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/moas");

      if (!response.ok) {
        throw new Error("Failed to fetch MOAs");
      }
      const data = await response.json();
    
      console.log("Fetched MOAs:", data);
    
      const moasData = data.moas || [];
      console.assert(Array.isArray(moasData), "Fetched data is not an array");
  
      // Retrieve role from localStorage
      const userRole = localStorage.getItem("role");
    
      // Role-based filtering
      let filteredMOAs;
      if (userRole === "Practicum Admin") {
        filteredMOAs = moasData.filter(moa => moa.type_of_moa === "Practicum");
      } else if (userRole === "Research Admin") {
        filteredMOAs = moasData.filter(moa => moa.type_of_moa === "Research" || moa.type_of_moa === "Scholarship");
      } else if (userRole === "Employment Admin") {
        filteredMOAs = moasData.filter(moa => moa.type_of_moa === "Employment");
      } else {
        filteredMOAs = moasData; // If no role matches, show all
      }
  
      setMoas(filteredMOAs);
    } catch (error) {
      console.error("Fetch MOAs error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEditClick = (moa) => {
    setSelectedMOA(moa);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (moa) => {
    setSelectedMOA(moa);
    setIsViewModalOpen(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMOAs();
  };

  const handleDelete = async (moaId) => {
    console.log("Deleting MOA with ID:", moaId);
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
        const errorData = await response.text();
        throw new Error(errorData || "Failed to delete MOA");
      }
  
      // Use moa_id for filtering instead of id
      setMoas(prev => prev.filter(moa => moa.moa_id !== moaId));
      toast.success("MOA deleted successfully");
      setDeleteModal({ isOpen: false, moa: null, isDeleting: false });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const toggleRowSelection = (moaId) => {
    setSelectedRows((prev) =>
      prev.includes(moaId)
        ? prev.filter((id) => id !== moaId)
        : [...prev, moaId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === moas.length) {
      setSelectedRows([]); // Deselect all
    } else {
      setSelectedRows(moas.map((moa) => moa.moa_id)); // Select all
    }
  }; 
  
  const isAllSelected = moas.length > 0 && selectedRows.length === moas.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < moas.length;

  const handleFilterChange = (filterType, value) => {
    onMoaFilterChange(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      direction: 
        prevConfig.field === field && prevConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    }));
  };

  const sortData = useCallback((data) => {
    if (!sortConfig.field) return data;
  
    return [...data].sort((a, b) => {
      if (sortConfig.field === 'expiry_date') {
        const dateA = new Date(a[sortConfig.field]);
        const dateB = new Date(b[sortConfig.field]);
        return sortConfig.direction === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      
      // Add string comparison for other fields
      const valueA = a[sortConfig.field] || '';
      const valueB = b[sortConfig.field] || '';
      
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }, [sortConfig]);
 
  const filteredMOAs = useMemo(() => {
    return Array.isArray(moas) ? sortData(moas.filter(moa => {
      const matchesSearch = (
        moa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        moa.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        moa.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      const matchesType = moaFilters.moaTypes.length === 0 || 
      moaFilters.moaTypes.includes(moa.type_of_moa);
  
      const matchesStatus = moaFilters.moaStatus.length === 0 || 
      moaFilters.moaStatus.includes(moa.moa_status);
  
      const matchesBranches = moaFilters.branch.length === 0 || 
      moaFilters.branch.includes(moa.branch);
  
      const matchesCourses = moaFilters.course.length === 0 || 
      moaFilters.course.includes(moa.course);
  
      return matchesSearch && matchesType && matchesStatus && matchesBranches && matchesCourses;
    })) : [];
  }, [moas, searchTerm, moaFilters, sortData]);

  const totalPages = Math.ceil(filteredMOAs.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedMOAs(filteredMOAs.slice(startIndex, endIndex));
  }, [currentPage, itemsPerPage, filteredMOAs]);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Max number of pages to show at a time
    const halfRange = Math.floor(maxPagesToShow / 2);
  
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);
  
    if (currentPage <= halfRange) {
      end = Math.min(totalPages, maxPagesToShow);
    }
  
    if (currentPage + halfRange >= totalPages) {
      start = Math.max(1, totalPages - maxPagesToShow + 1);
    }
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    return pages;
  };
  

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
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-row items-center gap-3">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search MOAs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-maroon focus:border-maroon outline-none w-full"
            />
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          {/* TODO Clear Filter */}
          <button
            onClick={clearFilters}
            disabled={refreshing}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FilterX className={`w-4 h-4`} />
            <span className="hidden sm:inline">Clear All Filters</span>
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <MOAHeader
              onSort={handleSort}
              sortConfig={sortConfig}
              filters={moaFilters}
              onFilterChange={onMoaFilterChange}
              isAllSelected={isAllSelected}
              isSomeSelected={isSomeSelected}
              onToggleSelectAll={toggleSelectAll}
            />
          </thead>
          <tbody>
            {Array.isArray(paginatedMOAs) && paginatedMOAs.length > 0 ? (
              paginatedMOAs.map((moa, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <input type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedRows.includes(moa.moa_id)}
                      onChange={() => toggleRowSelection(moa.moa_id)}
                    />
                  </td>
                  <td className="p-4 text-sm text-gray-900 relative cursor-pointer hover:text-maroon" onClick={() => handleViewClick(moa)}>  
                    {moa.has_nda === 1 && (
                      <div className="nda-ribbon">NDA</div>
                    )}{moa.name}
                  </td>
                  <td className="p-4 text-sm text-gray-900">{moa.type_of_moa}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.nature_of_business}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.address}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.contact_person || "N/A"}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.position}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.contact_number}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.email}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ 
                      moa.moa_status === 'Active' ? 'bg-green-100 text-green-800' : 
                      moa.moa_status === 'Expired' ? 'bg-red text-white' : 
                      'bg-yellow text-gray-900' 
                    }`}>
                      {moa.moa_status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-900">{moa.branch}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.course}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.years_validity}</td>
                  <td className="p-4 text-sm text-gray-900">{new Date(moa.date_notarized).toLocaleDateString()}</td>
                  <td className="p-4 text-sm text-gray-900">{new Date(moa.expiry_date).toLocaleDateString()}</td>
                  <td className="p-4 text-sm text-gray-900">{moa.year_submitted}</td>

                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (moa.file_path) {
                            // Open the PDF in a new tab
                            window.open(moa.file_path, '_blank');
                          } else {
                            toast.error("No file available for this MOA");
                            console.log(moa.file_path);
                          }
                        }}
                        className="text-slate-600 hover:text-slate-800 p-2 rounded-full hover:bg-slate-50 transition-colors"
                        title="View Document">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(moa)} // Pass the entire moa object
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit MOA"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteModal({ isOpen: true, moa, isDeleting: false })}
                        className="text-rose-600 hover:text-rose-800 p-2 rounded-full hover:bg-rose-50 transition-colors"
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
                {searchTerm || moaFilters.moaTypes.length > 0 || moaFilters.moaStatus.length > 0 || moaFilters.branch.length > 0 || moaFilters.course.length > 0 ? (
                  <p className="text-lg font-medium">No matching MOAs found</p>
                ) : (
                  <p className="text-lg font-medium">No MOAs found</p>
                )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center w-full gap-4 p-4 border-t border-gray-200 sm:flex-row sm:justify-center md:justify-between">
      <div className="flex items-center gap-2 sm:flex-nowrap sm:justify-start flex-1">
        <label className="text-xs sm:text-sm">
          Rows per page:
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1); // Reset to the first page
            }}
            className="ml-1 sm:ml-2 border rounded px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm"
          >
            {[5, 10, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs sm:text-sm text-gray-700">
          MOA Count: {filteredMOAs.length}
        </p>
      </div>

      {/* Pagination Controls*/}
      <div className="flex items-center gap-2 sm:justify-end flex-2">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded text-sm ${
            currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-maroon text-white"
          }`}
        >
          <span className="md:hidden">←</span>
          <span className="hidden md:inline">← Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1 sm:gap-2 mx-1 sm:mx-2">
          {getPageNumbers()[0] > 1 && <span className="px-2 py-1 sm:px-3">...</span>}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm ${
                page === currentPage ? "bg-maroon text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          {getPageNumbers().slice(-1)[0] < totalPages && <span className="px-2 py-1 sm:px-3">...</span>}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded text-sm ${
            currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-maroon text-white"
          }`}
        >
          <span className="md:hidden">→</span>
          <span className="hidden md:inline">Next →</span>
        </button>
      </div>
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
            onClick={() => {
              if (deleteModal.moa?.moa_id) {
                handleDelete(deleteModal.moa.moa_id);
              } else {
                toast.error("Invalid MOA ID");
              }
            }}
            disabled={deleteModal.isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-maroon hover:bg-red-600 disabled:bg-red-300 rounded-md transition-colors flex items-center gap-2"
          >
            {deleteModal.isDeleting ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

      <ExportExcelModal 
        isOpen={isExportExcelModalOpen}
        onClose={() => setIsExportExcelModalOpen(false)}
        filteredMOAs={filteredMOAs}
      />

      <ImportExcelModal 
        isOpen={isImportExcelModalOpen}
        onClose={() => setIsImportExcelModalOpen(false)}
        filteredMOAs={filteredMOAs}
      />

      {isEditModalOpen && selectedMOA && (
        <EditMOAModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMOA(null); // Clear selected MOA when closing
          }}
          moaData={selectedMOA} // Pass as moaData to match the prop name in the modal
          onMOAUpdated={() => {
            fetchMOAs();
            setIsEditModalOpen(false);
            setSelectedMOA(null);
          }}
        />
      )}
      
      {isViewModalOpen && selectedMOA && (
        <ViewMOAModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedMOA(null); // Clear selected MOA when closing
          }}
          formData={selectedMOA} // Pass as moaData to match the prop name in the modal
        />
      )}
    </div>
  );
}
