import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddAdminModal from './AddAdminModal'; 

export default function AddAdminButton() {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
      >
        <Plus className="h-4 w-4" />
        Add Admin
      </button>

      <AddAdminModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}