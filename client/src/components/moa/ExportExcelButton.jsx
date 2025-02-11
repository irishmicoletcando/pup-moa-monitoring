import { Sheet } from 'lucide-react';

export default function ExportExcelButton({ onClick }) {
  return (
    <div>
      <button 
        onClick={onClick}
        className="flex items-center justify-center gap-2 bg-maroon text-white px-4 py-2 rounded-xl hover:bg-red transition w-[48px] sm:w-[48px] md:w-[48px] lg:w-[160px]">
        <Sheet className="h-4 w-4" />
        <span className="hidden lg:inline-block ml-2">Export Excel</span>
      </button>
    </div>
  );
}