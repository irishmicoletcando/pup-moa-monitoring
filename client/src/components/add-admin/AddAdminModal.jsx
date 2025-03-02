import { useState } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

export default function AdminModal({ isOpen, onClose, onUserAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownEmailWarning, setHasShownEmailWarning] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Super Admin",
    contact: "",
    password: "",
    confirmPassword: "",
    accessOtherMoa: 0,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value, // Handle checkbox as 1 or 0
    });


    // if (name === "email") {
    //   const emailRegex = /^[a-zA-Z0-9._%+-]+@(pup\.edu\.ph|iskolarngbayan\.pup\.edu\.ph)$/;
  
    //   if (value === "") {
    //     setHasShownEmailWarning(false);
    //   } else if (!emailRegex.test(value)) {
    //     // Only show the toast once per invalid entry
    //     if (!hasShownEmailWarning) {
    //       toast.warn("Only PUP webmails are allowed.");
    //       setHasShownEmailWarning(true); // Prevent multiple toasts
    //     }
    //   } else {
    //     setHasShownEmailWarning(false);
    //   }
    // }

    // setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    const { firstName, lastName, email, role, contact, password, confirmPassword, accessOtherMoa } = formData;

    // const emailRegex = /^[a-zA-Z0-9._%+-]+@(pup\.edu\.ph|iskolarngbayan\.pup\.edu\.ph)$/;
  
    // if (!emailRegex.test(email)) {
    //   toast.error("Invalid email! Only PUP webmails are allowed.");
    //   return;
    // }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email,
          role,
          contactNumber: contact,
          password,
          access_other_moa: formData.accessOtherMoa || 0,
        }),
      });

      const textResponse = await response.text();
      let data;
      
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        data = { message: textResponse };
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create admin');
      }

      toast.success(data.message || "Admin created successfully!");
      
      // Call onUserAdded if it exists
      if (onUserAdded && typeof onUserAdded === 'function') {
        onUserAdded();
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "Super Admin",
        contact: "",
        password: "",
        confirmPassword: "",
        accessOtherMoa: false,
      });
      
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-md lg:max-w-lg mx-auto shadow-lg h-auto overflow-y-auto relative m-4 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Ex: John"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Ex: Dela Cruz"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ex: johndelacruz@pup.edu.ph"
              className="border-gray-300 border px-3 py-2 w-full rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block font-bold mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="border-gray-300 border px-3 py-2 w-full rounded-md"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Employment Admin">Employment Admin</option>
              <option value="Practicum Admin">Practicum Admin</option>
              <option value="Research Admin">Research Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact" className="block font-bold mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="Ex: 09123456789"
              className="border-gray-300 border px-3 py-2 w-full rounded-md"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="********"
                className="border-gray-300 border px-3 py-2 w-full rounded-md"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="accessOtherMoa"
              name="accessOtherMoa"
              checked={formData.accessOtherMoa === 1}
              onChange={handleChange}
              className="w-4 h-4 text-maroon border-gray-300 rounded focus:ring-maroon"
            />
            <label htmlFor="hasAccessToOtherMOA" className="font-medium text-gray-700 text-sm sm:text-base">
              Has Access to Other MOA
            </label>
          </div>

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
                Add Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}