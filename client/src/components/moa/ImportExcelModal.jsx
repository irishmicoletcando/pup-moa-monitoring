import { useState } from "react";
import { toast } from "react-toastify";
import { Plus, Upload, X } from "lucide-react";
import * as XLSX from "xlsx";

export default function ImportExcelModal({ isOpen, onClose, onMOAAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [excelData, setExcelData] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) =>
      file.name.match(/\.xlsx$|\.xls$/i)
    );

    if (validFiles.length === 0) {
      toast.error("Please upload only Excel files (.xlsx, .xls).");
      return;
    }

    // setFiles(validFiles);
    parseExcel(validFiles[0]);
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
  
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      // Convert Excel serial numbers to valid date strings
      const convertExcelDate = (excelSerial) => {
        if (!excelSerial || isNaN(excelSerial)) return excelSerial;
        const date = new Date((excelSerial - 25569) * 86400000);
        return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      };
  
      const formattedData = sheetData.map((row) => ({
        ...row,
        date_notarized: convertExcelDate(row.date_notarized),
        expiry_date: convertExcelDate(row.expiry_date),
      }));
  
      console.log("Parsed and formatted Excel Data:", formattedData);
      setExcelData(formattedData);
    };
  
    reader.readAsArrayBuffer(file);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    setExcelData([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (excelData.length === 0) {
        throw new Error("No Excel data to submit.");
      }

      const formData = new FormData();

      formData.append('data', JSON.stringify({
        moas: excelData.map((row) => ({
          name: row.name || "",
          typeOfMoa: row.typeOfMoa || "",
          natureOfBusiness: row.natureOfBusiness || "",
          address: row.address || "",
          contactFirstName: row.contactFirstName || "",
          contactLastName: row.contactLastName || "",
          position: row.position || "",
          branch: row.branch || "",
          course: row.course || "",
          contactNumber: row.contactNumber || "",
          emailAddress: row.emailAddress || "",
          status: row.status || "Active",
          years_validity: row.years_validity || "",
          date_notarized: row.date_notarized || new Date().toISOString().split("T")[0],
          expiry_date: row.expiry_date || new Date().toISOString().split("T")[0],
          year_submitted: row.year_submitted || new Date().getFullYear(),
          user_id: localStorage.getItem("user_id"),
          documents: row.documents || "",
          hasNDA: row.hasNDA === true ? 1 : (row.hasNDA === false ? 0 : null),
        }))
      }));

      

      if (files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await fetch("/api/moas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to import MOA data.");
      }

      toast.success("MOA data imported successfully!");
      if (onMOAAdded) onMOAAdded();

      setFiles([]);
      setExcelData([]);
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
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import Excel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-2">Upload Excel Files</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-gray-500 text-sm">Click to upload Excel files</span>
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

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="font-semibold">Selected Files:</p>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {excelData.length > 0 && (
            <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-auto">
              <p className="font-semibold mb-2">Parsed Data Preview:</p>
              <pre className="text-xs text-gray-700">{JSON.stringify(excelData.slice(0, 5), null, 2)}</pre>
              {excelData.length > 5 && <p className="text-xs text-gray-500">Showing first 5 entries...</p>}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-maroon hover:bg-red text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2${
                isSubmitting ? " opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  Import
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
