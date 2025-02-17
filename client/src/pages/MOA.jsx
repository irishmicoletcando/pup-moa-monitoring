import { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import AddMOAButton from '../components/moa/AddMOAButton.jsx';
import ExportMOAButton from '../components/moa/ExportButton.jsx';
import ExportExcelButton from '@/components/moa/ExportExcelButton.jsx';
import ImportExcelButton from '@/components/moa/ImportExcelButton.jsx';
import MOATable from '../components/moa/MOATable';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

export default function MOA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportExcelModalOpen, setIsImportExcelModalOpen] = useState(false);
  const [isExportExcelModalOpen, setIsExportExcelModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // Manage selected rows across components

  // Export logic
  const exportSelectedFiles = async () => {
    if (selectedRows.length === 0) {
      toast.error("No items selected for export.");
      return;
    }
  
    try {
      const fetchResponse = await fetch("/api/moas");
      if (!fetchResponse.ok) throw new Error("Failed to refetch MOAs");
      const { moas } = await fetchResponse.json(); // Assuming API returns { moas: [...] }
  
      // Filter selected MOAs based on `selectedRows`
      const selectedMOAs = selectedRows.map((id) => moas.find((moa) => moa.moa_id === id));
  
      // Validate file paths
      const validFiles = selectedMOAs
        .filter((moa) => moa?.file_path && typeof moa.file_path === "string")
        .map((moa) => ({ fileUrl: moa.file_path.trim(), fileName: moa.name }));
  
      if (validFiles.length === 0) {
        toast.error("No valid files to export.");
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
              {/* MULTIPLE EXPORT DOCUMENT MOA */}
              {/* <ExportMOAButton onClick={() => exportSelectedFiles}/> */}
              <ExportExcelButton onClick={()=> setIsExportExcelModalOpen(true)}/>
              <ImportExcelButton onClick={() => setIsImportExcelModalOpen(true)}/>
            </div>
          </div>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-x-auto shadow-sm">
            <MOATable 
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              isExportExcelModalOpen={isExportExcelModalOpen}
              setIsExportExcelModalOpen={setIsExportExcelModalOpen}
              isImportExcelModalOpen={isImportExcelModalOpen}
              setIsImportExcelModalOpen={setIsImportExcelModalOpen}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </div>
        </div>
      </div>
    </div>
  );
}