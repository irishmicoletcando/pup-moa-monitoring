import { useState } from "react";
import { toast } from "react-toastify";
import { Plus, Upload, X } from "lucide-react";

export default function AddMOAModal({ isOpen, onClose, onMOAAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    moaName: "",
    typeOfMoa: "Practicum",
    natureOfBusiness: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    emailAddress: "",
    moaStatus: "Active",
    validity: "",
    dateNotarized: "",
    hasNDA: false  // Add the NDA field
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle checkbox separately
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    try {
      // Create dates without time components
      const [year, month, day] = formData.dateNotarized.split('-').map(Number);
      const notarizedDate = new Date(year, month - 1, day);
      const expiryDate = new Date(year, month - 1, day);
      expiryDate.setFullYear(expiryDate.getFullYear() + parseInt(formData.validity));
      
      // Format dates as YYYY-MM-DD strings
      const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };
    
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Prepare documents array to match backend expectation
      const documentsArray = files.map(file => ({
        document_name: file.name
      }));
      
      // Append all the form fields
      const dataToSend = {
        name: formData.moaName,
        typeOfMoa: formData.typeOfMoa.trim(),
        nature_of_business: formData.natureOfBusiness,
        contactFirstName: formData.firstName,
        contactLastName: formData.lastName,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        status: formData.moaStatus,
        years_validity: formData.validity,
        date_notarized: formatDate(notarizedDate),
        expiry_date: formatDate(expiryDate),
        year_submitted: year,
        user_id: localStorage.getItem("user_id"),
        documents: documentsArray,
        hasNDA: formData.hasNDA  // Add the NDA field to the data being sent
      };
      
      // Validate required fields
      const requiredFields = Object.entries(dataToSend).filter(([key]) => 
        !['user_id', 'expiry_date', 'documents', 'hasNDA'].includes(key)
      );
      
      for (const [key, value] of requiredFields) {
        if (!value) {
          throw new Error(`${key.replace(/_/g, ' ')} is required`);
        }
      }
      
      // Append the stringified data object
      formDataToSend.append('data', JSON.stringify(dataToSend));
      
      // Append files with specific keys
      files.forEach((file) => {
        formDataToSend.append('files', file);
      });

    
      const response = await fetch("/api/moas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });
    
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create MOA");
      }
    
      const data = await response.json();
      toast.success(data.message || "MOA created successfully!");
    
      if (onMOAAdded && typeof onMOAAdded === "function") {
        onMOAAdded();
      }
    
      // Reset form
      setFormData({
        moaName: "",
        typeOfMoa: "Practicum",
        natureOfBusiness: "",
        firstName: "",
        lastName: "",
        contactNumber: "",
        emailAddress: "",
        moaStatus: "Active",
        validity: "",
        dateNotarized: "",
        hasNDA: false  // Reset the NDA field
      });
      setFiles([]);
    
      onClose();
    } catch (error) {
      console.error("Add MOA error:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Add MOA</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* MOA Name - Full width */}
          <div>
            <label htmlFor="moaName" className="block font-bold mb-2 text-sm sm:text-base">
              MOA Name
            </label>
            <input
              type="text"
              id="moaName"
              name="moaName"
              placeholder="Enter MOA name"
              className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
              value={formData.moaName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Type of MOA and Nature of Business */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="typeOfMoa" className="block font-bold mb-2 text-sm sm:text-base">
                Type of MOA
              </label>
              <select
                id="typeOfMoa"
                name="typeOfMoa"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.typeOfMoa}
                onChange={handleChange}
                required
              >
                <option value="Practicum">Practicum</option>
                <option value="Employment">Employment</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Research">Research</option>
              </select>
            </div>

            <div>
              <label htmlFor="natureOfBusiness" className="block font-bold mb-2 text-sm sm:text-base">
                Nature of Business
              </label>
              <input
                type="text"
                id="natureOfBusiness"
                name="natureOfBusiness"
                placeholder="Enter nature of business"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.natureOfBusiness}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contact Person - First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block font-bold mb-2 text-sm sm:text-base">
                Contact Person First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-bold mb-2 text-sm sm:text-base">
                Contact Person Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          {/* Contact Number and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactNumber" className="block font-bold mb-2 text-sm sm:text-base">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="Enter contact number"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="emailAddress" className="block font-bold mb-2 text-sm sm:text-base">
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                placeholder="Enter email address"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.emailAddress}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* MOA Status, Validity, and Date Notarized */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="moaStatus" className="block font-bold mb-2 text-sm sm:text-base">
                MOA Status
              </label>
              <select
                id="moaStatus"
                name="moaStatus"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.moaStatus}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Expiry">Expiry</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label htmlFor="validity" className="block font-bold mb-2 text-sm sm:text-base">
                Validity
              </label>
              <input
                type="number"
                id="validity"
                name="validity"
                placeholder="Enter validity period"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.validity}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="dateNotarized" className="block font-bold mb-2 text-sm sm:text-base">
                Date Notarized
              </label>
              <input
                type="date"
                id="dateNotarized"
                name="dateNotarized"
                className="border-gray-300 border px-3 py-2 w-full rounded-md text-sm sm:text-base"
                value={formData.dateNotarized}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* New Document Upload Section */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2 text-sm sm:text-base">
                Upload Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm sm:text-base">
                <div className="flex items-center justify-center">
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Click to upload documents</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* NDA Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasNDA"
                name="hasNDA"
                checked={formData.hasNDA}
                onChange={handleChange}
                className="w-4 h-4 text-maroon border-gray-300 rounded focus:ring-maroon"
              />
              <label htmlFor="hasNDA" className="font-medium text-gray-700 text-sm sm:text-base">
                Has Non-Disclosure Agreement (NDA)
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold">Selected Files:</p>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-maroon hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add MOA
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}