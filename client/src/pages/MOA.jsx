import Navbar from '../components/layout/Navbar.jsx';
import AddMOAButton from '../components/moa/AddMOAButton.jsx';
import MOATable from '../components/moa/MOATable';

export default function MOA() {
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
              <h1 className="text-3xl font-bold">MOAs</h1>
            </div>
            <AddMOAButton />
          </div>

          {/* Table Section */}
          <div className="bg-gray-50 rounded-lg">
            <MOATable />
          </div>
        </div>
      </div>
    </div>
  );
}