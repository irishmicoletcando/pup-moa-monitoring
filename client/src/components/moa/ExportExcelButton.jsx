import { Sheet } from 'lucide-react';

export default function ExportExcelButton({ onClick }) {
  return (
    <div>
      <button 
        onClick={onClick}
        className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-xl hover:bg-red transition">
        <Sheet className="h-4 w-4" />
        <span className="hidden sm:inline-block ml-2">Export Excel</span>
      </button>
    </div>
  );
}