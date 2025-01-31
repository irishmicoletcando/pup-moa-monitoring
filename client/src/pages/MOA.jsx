import { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import AddMOAButton from '../components/moa/AddMOAButton.jsx';
import ExportMOAButton from '../components/moa/ExportButton.jsx';
import MOATable from '../components/moa/MOATable';

export default function MOA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          <div className="flex flex-col ml-auto">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">MOAs</h1>
            <div className="flex gap-4 ml-auto">
              <AddMOAButton onClick={() => setIsModalOpen(true)} />
              <ExportMOAButton onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-x-auto shadow-sm">
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