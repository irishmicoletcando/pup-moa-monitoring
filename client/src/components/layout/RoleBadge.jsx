export default function RoleBadge({ role }) {
  const roleStyles = {
    'Super Admin': 'bg-purple-100 text-purple-800 border-purple-200',
    'Employment Admin': 'bg-blue-100 text-blue-800 border-blue-200',
    'Practicum Admin': 'bg-green-100 text-green-800 border-green-200',
    'Research Admin': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${roleStyles[role] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {role}
    </span>
  );
}
