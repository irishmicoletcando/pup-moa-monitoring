import AdminHeader from "./AdminHeader";

export default function AdminTable() {
  const moas = [
    {
      name: 'Florinda Oquindo',
      email: 'florindaoquindo@pup.edu.ph',
      lastLogin: '1 min ago',
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light-gray">
            <AdminHeader />
          </thead>
          <tbody>
            {moas.map((moa, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="p-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </td>
                <td className="p-4 text-sm text-gray-900">{moa.name}</td>
                <td className="p-4 text-sm text-gray-900">{moa.email}</td>
                <td className="p-4 text-sm text-gray-900">{moa.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};