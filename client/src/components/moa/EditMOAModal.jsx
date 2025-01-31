import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Upload, X } from "lucide-react";

export default function EditMOAModal({ isOpen, onClose, moaData, onMOAUpdated }) {
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
    validity: "",
    dateNotarized: ""
  });

  useEffect(() => {
    if (moaData) {
      setFormData({ ...moaData });
    }
  }, [moaData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const updatedData = { ...formData, user_id: localStorage.getItem("user_id") };
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(updatedData));
      files.forEach((file) => formDataToSend.append("files", file));

      const response = await fetch(`/api/moas/${moaData.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update MOA");
      }
      toast.success("MOA updated successfully!");
      onMOAUpdated();
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
          <h2 className="text-xl font-bold">Edit MOA</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="moaName" className="block font-bold mb-2">MOA Name</label>
            <input type="text" id="moaName" name="moaName" className="border-gray-300 border px-3 py-2 w-full rounded-md" value={formData.moaName} onChange={handleChange} required />
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="typeOfMoa" className="block font-bold mb-2">Type of MOA</label>
              <select id="typeOfMoa" name="typeOfMoa" className="border-gray-300 border px-3 py-2 w-full rounded-md" value={formData.typeOfMoa} onChange={handleChange} required>
                <option value="Practicum">Practicum</option>
                <option value="Employment">Employment</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Research">Research</option>
              </select>
            </div>
            <div>
              <label htmlFor="natureOfBusiness" className="block font-bold mb-2">Nature of Business</label>
              <input type="text" id="natureOfBusiness" name="natureOfBusiness" className="border-gray-300 border px-3 py-2 w-full rounded-md" value={formData.natureOfBusiness} onChange={handleChange} required />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block font-bold mb-2">Contact First Name</label>
              <input type="text" id="firstName" name="firstName" className="border-gray-300 border px-3 py-2 w-full rounded-md" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-bold mb-2">Contact Last Name</label>
              <input type="text" id="lastName" name="lastName" className="border-gray-300 border px-3 py-2 w-full rounded-md" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactNumber" className="block font-bold mb-2">Contact Number</label>
              <input type="tel" id="contactNumber" name="contactNumber" className="border-gray-300 border px-3 py-2 w-full rounded-md" value={formData.contactNumber} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="emailAddress" className="block font-bold mb-2">Email Address</label>
              <input type="email" id="emailAddress" name="emailAddress" className="border-gray-300 border px-3 py-2 w-full rounded-md" value={formData.emailAddress} onChange={handleChange} required />
            </div>
          </div>

          {/* MOA Status, Validity, and Date Notarized */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="validity" className="block font-bold mb-2">
                Validity
              </label>
              <input
                type="number"
                id="validity"
                name="validity"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.validity}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="dateNotarized" className="block font-bold mb-2">
                Date Notarized
              </label>
              <input
                type="date"
                id="dateNotarized"
                name="dateNotarized"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.dateNotarized}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2">Upload New Documents</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Click to upload documents</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
              </label>
            </div>
          </div>
          {files.length > 0 && files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm truncate">{file.name}</span>
              <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="submit" disabled={isSubmitting} className="w-full bg-maroon hover:bg-red text-white font-bold py-2 px-4 rounded-md">
            {isSubmitting ? "Updating..." : "Update MOA"}
          </button>
        </form>
      </div>
    </div>
  );
}
