export default function DashboardStats() {
  return (
    <main className="flex-1 px-10 py-5">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      {/* MOA Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
        <div>
          <h2 className="text-lg font-bold mb-4">Employment</h2>
          <div className="bg-light-gray p-6 rounded-lg flex flex-row justify-center items-center space-x-4">
            <p className="text-7xl font-bold">300+</p>
            <p className="text-gray-600 font-semibold mt-4">Number of Employment MOAs</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Research</h2>
          <div className="bg-light-gray p-6 rounded-lg flex flex-row justify-center items-center space-x-4">
            <p className="text-7xl font-bold">300+</p>
            <p className="text-gray-600 font-semibold mt-4">Number of Research MOAs</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-bold mb-4">Practicum</h2>
          <div className="bg-light-gray p-6 rounded-lg flex flex-row justify-center items-center space-x-4">
            <p className="text-7xl font-bold">300+</p>
            <p className="text-gray-600 font-semibold mt-4">Number of Practicum MOAs</p>
          </div>
        </div>
      </div>
    </main>
  )
}
