import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Upload, X } from "lucide-react";

export default function ImportExcelModal({ isOpen, onClose, onMOAAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    moaName: "",
    typeOfMoa: "Practicum",
    natureOfBusiness: "",
    address: "",
    firstName: "",
    lastName: "",
    position: "",
    branch: "",
    course: "",
    contactNumber: "",
    emailAddress: "",
    moaStatus: "Active",
    validity: "",
    dateNotarized: "",
    hasNDA: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) =>
      file.name.match(/\.xlsx$|\.xls$/i)
    );
    if (validFiles.length === 0) {
      toast.error("Please upload only Excel files (.xlsx, .xls).");
    } else {
      setFiles(validFiles);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { dateNotarized, validity } = formData;
      const [year, month, day] = dateNotarized.split("-").map(Number);
      const notarizedDate = new Date(year, month - 1, day);
      const expiryDate = new Date(notarizedDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + parseInt(validity));

      // Prepare data to send
      const formDataToSend = new FormData();
      const documentsArray = files.map((file) => ({
        document_name: file.name,
      }));

      const dataToSend = {
        name: formData.moaName,
        typeOfMoa: formData.typeOfMoa.trim(),
        nature_of_business: formData.natureOfBusiness,
        address: formData.address,
        contactFirstName: formData.firstName,
        contactLastName: formData.lastName,
        position: formData.position,
        branch: formData.branch,
        course: formData.course,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        status: formData.moaStatus,
        years_validity: formData.validity,
        date_notarized: notarizedDate.toISOString().split("T")[0],
        expiry_date: expiryDate.toISOString().split("T")[0],
        year_submitted: year,
        user_id: localStorage.getItem("user_id"),
        documents: documentsArray,
        hasNDA: formData.hasNDA,
      };

      // Validate required fields
      const requiredFields = Object.entries(dataToSend).filter(
        ([key]) => !["user_id", "expiry_date", "documents", "hasNDA"].includes(key)
      );
      for (const [key, value] of requiredFields) {
        if (!value) throw new Error(`${key.replace(/_/g, " ")} is required`);
      }

      // Append the data
      formDataToSend.append("data", JSON.stringify(dataToSend));
      files.forEach((file) => formDataToSend.append("files", file));

      // Send request
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

      if (onMOAAdded) onMOAAdded();

      // Reset form
      setFormData({
        moaName: "",
        typeOfMoa: "Practicum",
        natureOfBusiness: "",
        address: "",
        firstName: "",
        lastName: "",
        position: "",
        branch: "",
        course: "",
        contactNumber: "",
        emailAddress: "",
        moaStatus: "Active",
        validity: "",
        dateNotarized: "",
        hasNDA: false,
      });
      setFiles([]);
      onClose();
    } catch (error) {
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
          <h2 className="text-xl font-bold">Import Excel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2 text-sm sm:text-base">
                Upload Excel Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm sm:text-base">
                <div className="flex items-center justify-center">
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Click to upload Excel files</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".xlsx,.xls"
                    />
                  </label>
                </div>
              </div>
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
                isSubmitting ? " opacity-50 cursor-not-allowed" : ""
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
                  Import Excel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}