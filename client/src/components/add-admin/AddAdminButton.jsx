import { Plus } from 'lucide-react';

export default function AddAdminButton() {
  return (
    <div>
      <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800">
        <Plus className="h-4 w-4" />
        Add Admin
      </button>
    </div>
  )
}
