import { Download } from 'lucide-react';

export default function ExportMOAButton({ onClick }) {
  return (
    <div>
      <button 
        onClick={onClick}
        className="flex items-center justify-center gap-2 bg-maroon text-white px-4 py-2 rounded-xl hover:bg-red transition w-[48px] sm:w-[48px] md:w-[48px] lg:w-[160px]">
        <div className="relative">
          <Download className="h-4 w-4" />
        </div>
        {/* Text hidden for small and medium screens */}
        <span className="hidden lg:inline-block ml-2">Export</span>
      </button>
    </div>
  );
}