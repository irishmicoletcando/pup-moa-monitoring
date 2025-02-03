import { FileSpreadsheet, ArrowUp } from 'lucide-react';

export default function ImportExcelButton({ onClick }) {
  return (
    <div>
      <button 
        onClick={onClick}
        className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-xl hover:bg-red transition">
        <div className="relative">
          <FileSpreadsheet className="h-4 w-4" />
          <ArrowUp className="h-3 w-3 absolute -bottom-1 -right-1 text-white" />
        </div>
        <span className="hidden sm:inline-block ml-2">Import Excel</span>
      </button>
    </div>
  );
}