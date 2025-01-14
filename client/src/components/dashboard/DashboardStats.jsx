export default function DashboardStats() {
  return (
    <main className="flex-1 px-10 py-5">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      {/* MOA Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
        <div>
          <h2 className="text-lg font-semibold mb-4">Employment MOA</h2>
          <div className="bg-light-gray p-6 rounded-lg flex flex-row justify-center items-center">
            <p className="text-7xl font-bold">300+</p>
            <p className="text-sm text-gray-600 mt-2">Number of Employment MOAs</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Research MOA</h2>
          <div className="bg-light-gray p-6 rounded-lg flex flex-row justify-center items-center">
            <p className="text-7xl font-bold">300+</p>
            <p className="text-sm text-gray-600 mt-2">Number of Research MOAs</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Practicum MOA</h2>
          <div className="bg-light-gray p-6 rounded-lg flex flex-row justify-center items-center">
            <p className="text-7xl font-bold">300+</p>
            <p className="text-sm text-gray-600 mt-2">Number of Practicum MOAs</p>
          </div>
        </div>
      </div>
    </main>
  )
}
