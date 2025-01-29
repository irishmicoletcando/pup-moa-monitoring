import { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import AddMOAButton from '../components/moa/AddMOAButton.jsx';
import MOATable from '../components/moa/MOATable';

export default function MOA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-x-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">MOAs</h1>
            </div>
            <AddMOAButton onClick={() => setIsModalOpen(true)} />
          </div>
          <div className="bg-gray-50 rounded-lg">
            <MOATable 
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}