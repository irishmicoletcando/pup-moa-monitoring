import { useState, useCallback } from 'react';
import AddAdminButton from '../components/add-admin/AddAdminButton.jsx';
import AdminTable from '../components/add-admin/AdminTable.jsx';
import AddAdminModal from '../components/add-admin/AddAdminModal.jsx'
import Navbar from '../components/layout/Navbar.jsx';

export default function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [softRefreshTrigger, setSoftRefreshTrigger] = useState(0);

  // Handle refresh when new admin is added
  const handleRefreshNeeded = () => {
    setRefreshTrigger((prev) => prev + 1); 
  };
  const handleSoftRefresh = () => {
    setSoftRefreshTrigger((prev) => prev + 1); 
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-x-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Admins</h1>
            </div>
            <AddAdminButton onClick={() => setIsModalOpen(true)} onUserAdded={handleSoftRefresh} />
          </div>

          <div className="bg-gray-50 rounded-lg overflow-x-auto shadow-sm pb-16">
            <AdminTable
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              refreshTrigger={refreshTrigger}
              softRefreshTrigger={softRefreshTrigger}
            />

            <AddAdminModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onUserAdded={handleRefreshNeeded}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
