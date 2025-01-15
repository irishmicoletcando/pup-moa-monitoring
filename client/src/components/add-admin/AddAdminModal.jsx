import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus } from "lucide-react";

export default function AdminModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Super Admin",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, role, contact, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" });
      return;
    }

    try {
      const response = await fetch("/api/auth/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email,
          role,
          contactNumber: contact,
          password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      toast.success("Admin created successfully!", { position: "top-right" });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "Super Admin",
        contact: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      toast.error(err.message, { position: "top-right" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name fields row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Ex: John"
                className="border-gray-300 border-2 px-3 py-2 w-full rounded-md"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Ex: Dela Cruz"
                className="border-gray-300 border-2 px-3 py-2 w-full rounded-md"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ex: johndelacruz@pup.edu.ph"
              className="border-gray-300 border-2 px-3 py-2 w-full rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role field */}
          <div>
            <label htmlFor="role" className="block font-bold mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="border-gray-300 border-2 px-3 py-2 w-full rounded-md"
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

          {/* Contact field */}
          <div>
            <label htmlFor="contact" className="block font-bold mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="Ex: 09123456789"
              className="border-gray-300 border-2 px-3 py-2 w-full rounded-md"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              className="border-gray-300 border-2 px-3 py-2 w-full rounded-md"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password field */}
          <div>
            <label htmlFor="confirmPassword" className="block font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="********"
              className="border-gray-300 border-2 px-3 py-2 w-full rounded-md"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-maroon hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Admin
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}