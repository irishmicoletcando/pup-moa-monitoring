"use client"

import { X, FileText, Building, User, Briefcase, Phone, Mail, CheckCircle, Calendar, Clock, MapPin, GraduationCap, Shield, Type } from "lucide-react";
import { useState, useEffect } from "react";

const ViewMoaModal = ({ isOpen, formData, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const sections = [
    { label: "MOA Name", value: formData.name, icon: FileText },
    {
      label: "Type of MOA",
      value:
        formData.type_of_moa === 1
          ? "Practicum"
          : formData.type_of_moa === 2
          ? "Employment"
          : formData.type_of_moa === 3
          ? "Scholarship"
          : "Research",
      icon: Type,
    },
    { label: "Nature of Business", value: formData.nature_of_business, icon: Briefcase },
    { label: "Company Address", value: formData.address, icon: MapPin },
    { label: "Contact Person", value: `${formData.firstname} ${formData.lastname}`, icon: User },
    { label: "Position", value: formData.position, icon: Briefcase },
    { label: "Contact Number", value: formData.contact_number, icon: Phone },
    { label: "Email Address", value: formData.email_address, icon: Mail },
    { label: "MOA Status", value: formData.status, icon: CheckCircle },
    { label: "Years Validity", value: formData.years_validity, icon: Clock },
    { label: "Date Notarized", value: formData.date_notarized, icon: Calendar },
    { label: "Expiry Date", value: formData.expiry_date, icon: Calendar },
    { label: "Year Submitted", value: formData.year_submitted, icon: Calendar },
    { label: "Branch", value: formData.branch, icon: Building },
    { label: "Course", value: formData.course, icon: GraduationCap },
    { label: "Has NDA?", value: formData.has_nda ? "Yes" : "No", icon: Shield },
  ];

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-lg overflow-hidden">
        <div className="bg-maroon text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={20} />
            {sections.find((section) => section.label === "MOA Name").value}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <InfoSection key={index} label={section.label} value={section.value} Icon={section.icon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoSection = ({ label, value, Icon }) => (
  <div className="bg-red-50 p-4 rounded-lg shadow flex items-center gap-4">
    <Icon className="text-red-800" size={20} />
    <div>
      <p className="font-semibold text-sm text-red-800 mb-1">{label}</p>
      <p className="text-red-900">{value || "N/A"}</p>
    </div>
  </div>
);

export default ViewMoaModal;
