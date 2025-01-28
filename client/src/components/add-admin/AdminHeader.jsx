export default function AdminHeader() {
  return (
    <tr>
      <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
      <th className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="truncate">Email</div>
      </th>
      <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
      <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
      <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
    </tr>
  )
}