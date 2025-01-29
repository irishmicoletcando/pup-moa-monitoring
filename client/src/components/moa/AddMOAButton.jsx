import { Plus } from 'lucide-react';

export default function AddMOAButton({ onClick }) {
  return (
    <div>
      <button 
        onClick={onClick}
        className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-xl hover:bg-red">
        <Plus className="h-4 w-4" />
        Add MOA
      </button>
    </div>
  )
}
