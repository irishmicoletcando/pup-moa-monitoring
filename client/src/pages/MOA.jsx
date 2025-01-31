import { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import AddMOAButton from '../components/moa/AddMOAButton.jsx';
import ExportMOAButton from '../components/moa/ExportButton.jsx';
import MOATable from '../components/moa/MOATable';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

export default function MOA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // Manage selected rows across components

  // Export logic
  const exportSelectedFiles = async () => {
    if (selectedRows.length === 0) {
      toast.error("No items selected for export.");
      return;
    }
  
    try {
      const fileData = await Promise.all(
        selectedRows.map(async (moaId) => {
          try {
            const response = await fetch(`/api/moas/${moaId}`);
            if (!response.ok) throw new Error(`Failed to fetch MOA ID: ${moaId}`);
  
            const { moa } = await response.json(); // Extract the MOA object
            // console.log("MOA Data:", moa); // Debugging
  
            const filePath = moa?.file_path?.trim();
            if (!filePath || typeof filePath !== "string") {
              throw new Error(`No file for MOA ID: ${moaId}`);
            }
  
            return { fileUrl: filePath, fileName: moa.name }; // Store file details
          } catch (error) {
            console.error(error);
            return null; // Skip failed files
          }
        })
      );
  
      // Filter out failed file fetches
      const validFiles = fileData.filter((file) => file !== null);
      if (validFiles.length === 0) {
        toast.error("Failed to download selected MOAs.");
        return;
      }
  
      // If only one file, download it directly
      if (validFiles.length === 1) {
        const { fileUrl, fileName } = validFiles[0];
      
        try {
          const fileResponse = await fetch(fileUrl);
          if (!fileResponse.ok) throw new Error(`Failed to fetch file: ${fileUrl}`);
      
          const blob = await fileResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
      
          const anchor = document.createElement("a");
          anchor.href = blobUrl;
          anchor.download = `${fileName}.pdf`; // Forces "Save As" with correct name
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
      
          URL.revokeObjectURL(blobUrl); // Cleanup memory
          toast.success(`Export successful!`);
        } catch (error) {
          console.error("Download error:", error);
          toast.error("Failed to download file.");
        }
      
        return;
      }
  
      // If multiple files, zip them
      const zip = new JSZip();
      await Promise.all(
        validFiles.map(async ({ fileUrl, fileName }) => {
          try {
            const fileResponse = await fetch(fileUrl);
            if (!fileResponse.ok) throw new Error(`Failed to fetch file: ${fileUrl}`);
  
            const blob = await fileResponse.blob();
            zip.file(`${fileName}.pdf`, blob);
          } catch (error) {
            console.error(error);
          }
        })
      );
  
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      saveAs(zipBlob, `MOAs_${today}.zip`);
      toast.success("Export successful!");
  
    } catch (error) {
      console.error("Export error:", error);
      toast.error(`Failed to export files: ${error.message}`);
    }
  };
  

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="flex flex-col ml-auto">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">MOAs</h1>
            <div className="flex gap-4 ml-auto">
              <AddMOAButton onClick={() => setIsModalOpen(true)} />
              <ExportMOAButton onClick={exportSelectedFiles}/>
            </div>
          </div>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-x-auto shadow-sm pb-16">
            <MOATable 
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </div>
        </div>
      </div>
    </div>
  );
}