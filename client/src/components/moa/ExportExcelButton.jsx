import { Sheet } from "lucide-react"

export default function ExportExcelButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 
                 bg-maroon text-white 
                 px-3 py-2 rounded-md
                 shadow-sm
                 hover:bg-red hover:shadow-md
                 active:bg-maroon active:scale-95
                 transition-all duration-200 ease-in-out
                 w-12 md:w-12 lg:w-40
                 border border-maroon
                 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-2"
    >
      <Sheet className="h-4 w-4" />
      <span className="hidden lg:inline-block font-medium truncate">Export Excel</span>
    </button>
  )
}