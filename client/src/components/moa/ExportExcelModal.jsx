import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const ExportExcelModal = ({ isOpen, onClose, filteredMOAs }) => {
  const columns = [
    "Name", "Type of MOA", "Nature of Business", "Company Address", 
    "Contact Person", "Contact Position", "Contact Number", "Email Address", 
    "MOA Status", "Validity", "Date Notarized", "Expiry Date", "Year Submitted to ARCDO"
  ];

  const columnMapping = {
    "Name": "name",
    "Type of MOA": "type_of_moa",
    "Nature of Business": "nature_of_business",
    "Company Address": "address",
    "Contact Person": "contact_person",
    "Contact Position": "position",
    "Contact Number": "contact_number",
    "Email Address": "email",
    "MOA Status": "moa_status",
    "Validity": "years_validity",
    "Date Notarized": "date_notarized",
    "Expiry Date": "expiry_date",
    "Year Submitted to ARCDO": "year_submitted",
  };

  const [selectedColumns, setSelectedColumns] = useState(["Name"]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll) {
      setSelectedColumns([...columns]);
    } else if (selectedColumns.length === columns.length) {
      setSelectedColumns(["Name"]);
    }
  }, [selectAll]);

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

    const exportData = filteredMOAs.map((moa) => {
      let row = {};
      selectedColumns.forEach((col) => {
        const key = columnMapping[col];
        row[col] = moa[key] || "N/A";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MOA Export");
    XLSX.writeFile(workbook, "MOAs.xlsx");
    
    toast.success("Excel file exported successfully");
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
        < br />
        <i className="text-sm text-gray-600 dark:text-gray-300 mt-2">NOTE: The data exported will be based on filters selected on the dropdowns in the column header (e.g., type or status). To export all MOAs, remove the filters.</i>
        <div className="mt-4 max-h-48 overflow-y-auto border p-2 rounded-md">
          <label className="flex items-center space-x-2 mb-2 text-gray-900 dark:text-white">
            <input
              type="checkbox"
              checked={selectedColumns.length === columns.length}
              onChange={() => setSelectAll(!selectAll)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span>Select All</span>
          </label>
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
            className="px-4 py-2 bg-maroon text-white rounded-md hover:bg-rose-900"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportExcelModal;
