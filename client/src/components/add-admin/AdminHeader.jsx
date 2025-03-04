export default function AdminHeader() {
  const userRole = localStorage.getItem("role"); // Get the role from localStorage
  return (
    <tr>
      <th className="p-4 text-left text-sm font-medium">Name</th>
      <th className="p-4 text-left text-sm font-medium">
        <div className="truncate">Email</div>
      </th>
      <th className="p-4 text-left text-sm font-medium">Role</th>
      <th className="p-4 text-left text-sm font-medium">Last Login</th>
      {/* Only show checkbox if role is "Super Admin" */}
      {userRole === "Super Admin" && (
        <th className="p-4 text-left text-sm font-medium">Access Other MOA?</th>
      )}
      <th className="p-4 text-left text-sm font-medium"></th>
    </tr>
  )
}