import { useState } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

export default function AddMOAModal({ isOpen, onClose, onMOAAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    moaName: "",
    typeOfMoa: "Practicum",
    natureOfBusiness: "",
    contactPerson: "",
    contactNumber: "",
    emailAddress: "",
    moaStatus: "Active",
    validity: "",
    dateNotarized: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/moa/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        data = { message: textResponse };
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create MOA');
      }

      toast.success(data.message || "MOA created successfully!");
      
      if (onMOAAdded && typeof onMOAAdded === 'function') {
        onMOAAdded();
      }

      setFormData({
        moaName: "",
        typeOfMoa: "Practicum",
        natureOfBusiness: "",
        contactPerson: "",
        contactNumber: "",
        emailAddress: "",
        moaStatus: "Active",
        validity: "",
        dateNotarized: ""
      });
      
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
            <label htmlFor="moaName" className="block font-bold mb-2">
              MOA Name
            </label>
            <input
              type="text"
              id="moaName"
              name="moaName"
              placeholder="Enter MOA name"
              className="border-gray-300 border px-3 py-2 w-full rounded-md"
              value={formData.moaName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Type of MOA and Nature of Business - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="typeOfMoa" className="block font-bold mb-2">
                Type of MOA
              </label>
              <select
                id="typeOfMoa"
                name="typeOfMoa"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
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
              <label htmlFor="natureOfBusiness" className="block font-bold mb-2">
                Nature of Business
              </label>
              <input
                type="text"
                id="natureOfBusiness"
                name="natureOfBusiness"
                placeholder="Enter nature of business"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.natureOfBusiness}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contact Person - Full width */}
          <div>
            <label htmlFor="contactPerson" className="block font-bold mb-2">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              placeholder="Enter contact person name"
              className="border-gray-300 border px-3 py-2 w-full rounded-md"
              value={formData.contactPerson}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Number and Email - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactNumber" className="block font-bold mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="Enter contact number"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="emailAddress" className="block font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                placeholder="Enter email address"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.emailAddress}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* MOA Status, Validity, and Date Notarized - Side by side */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="moaStatus" className="block font-bold mb-2">
                MOA Status
              </label>
              <select
                id="moaStatus"
                name="moaStatus"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
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
              <label htmlFor="validity" className="block font-bold mb-2">
                Validity
              </label>
              <input
                type="number"
                id="validity"
                name="validity"
                placeholder="Enter validity period"
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

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-maroon hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
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