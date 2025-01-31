import { Download } from 'lucide-react';

export default function ExportMOAButton({ onClick }) {
  return (
    <div>
      <button 
        onClick={onClick}
        className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-xl hover:bg-red">
        {/* Icon only on small screens */}
        <Download className="h-4 w-4" />
        {/* Text and icon on larger screens */}
        <span className="hidden sm:inline-block ml-2">Export</span> {/* Text only on sm or larger */}
      </button>
    </div>
  );
}
