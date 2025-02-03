import React, { useState } from "react";
import { toast } from "react-toastify";

const ExportExcelModal = ({ isOpen, onClose, onExport }) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  
  const columns = [
    "Name", "Type of MOA", "Nature of Business", "Company Address", 
    "Contact Person", "Contact Position", "Contact Number", "Email Address", 
    "MOA Status", "Validity", "Date Notarized", "Expiry Date", "Year Submitted to ARCDO"
  ];

  const handleColumnChange = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to export.");
      return;
    }
    onExport(selectedColumns);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Excel</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Select the columns you want to export:
        </p>
        <div className="mt-4 max-h-48 overflow-y-auto border p-2 rounded-md">
          {columns.map((column) => (
            <label key={column} className="flex items-center space-x-2 mb-2 text-gray-900 dark:text-white">
              <input
                type="checkbox"
                checked={selectedColumns.includes(column)}
                onChange={() => handleColumnChange(column)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span>{column}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportExcelModal;
