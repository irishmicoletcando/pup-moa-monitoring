import MOAHeader from "./MOAHeader";

export default function MOATable() {
  const moas = [
    {
      name: 'CompanyX',
      type: 'Practicum',
      contactPerson: 'Mark Perez',
      contactNumber: '09123456789',
      email: 'mark@companyx.com',
      status: 'Active',
      validity: 3,
      dateNotarized: '05/22/23',
      expiryDate: '05/31/26', 
      yearSubmitted: 2023
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light-gray">
            <MOAHeader />
          </thead>
          <tbody>
            {moas.map((moa, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="p-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </td>
                <td className="p-4 text-sm text-gray-900">{moa.name}</td>
                <td className="p-4 text-sm text-gray-900">{moa.type}</td>
                <td className="p-4 text-sm text-gray-900">{moa.contactPerson}</td>
                <td className="p-4 text-sm text-gray-900">{moa.contactNumber}</td>
                <td className="p-4 text-sm text-gray-900">{moa.email}</td>
                <td className="p-4 text-sm text-gray-900">{moa.status}</td>
                <td className="p-4 text-sm text-gray-900">{moa.validity}</td>
                <td className="p-4 text-sm text-gray-900">{moa.dateNotarized}</td>
                <td className="p-4 text-sm text-gray-900">{moa.expiryDate}</td>
                <td className="p-4 text-sm text-gray-900">{moa.yearSubmitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};