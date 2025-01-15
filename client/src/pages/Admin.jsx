import AddAdminButton from '../components/add-admin/AddAdminButton.jsx';
import AdminTable from '../components/add-admin/AdminTable.jsx';
import Navbar from '../components/layout/Navbar.jsx';

export default function Admin() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Left Sidebar */}
      <Navbar />

      {/* Main Content Area with Scroll */}
      <div className="flex-1 overflow-x-auto">
        <div className="p-6">
          {/* Header with Title and Add Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Admins</h1>
            </div>
            <AddAdminButton />
          </div>

          {/* Table Section */}
          <div className="bg-gray-50 rounded-lg">
            <AdminTable />
          </div>
        </div>
      </div>
    </div>
  );
}