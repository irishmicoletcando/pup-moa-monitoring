import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Fix CORS issues when loading PDFs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ fileUrl, onClose }) => {
  const [numPages, setNumPages] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
        {/* Header with Download & Close Buttons */}
        <div className="flex justify-between items-center mb-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => window.open(fileUrl, "_blank")}
          >
            Download PDF
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Close
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="overflow-auto max-h-[80vh]">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={index} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
