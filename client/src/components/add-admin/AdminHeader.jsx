export default function AdminHeader() {
  return (
    <tr>
      <th className="w-12 p-4">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
      </th>
      <th className="p-4 text-left text-sm font-medium">
        Name
      </th>
      <th className="p-4 text-left text-sm font-medium">
        Email
      </th>
      <th className="p-4 text-left text-sm font-medium">
        Last Login
      </th>
    </tr>
  )
}
