import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddAdminModal from './AddAdminModal';

export default function AddAdminButton({ onUserAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {     
        // Retrieve the JWT token and logged-in user email from localStorage
        const token = localStorage.getItem('token');
        const loggedInEmail = localStorage.getItem('userEmail');

        if (!token || !loggedInEmail) {
          throw new Error('JWT token or logged-in user email not found');
        }
  
        const response = await fetch('/api/auth/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const { users } = await response.json(); // Destructure to get the `users` array
        
        // Find the logged-in user in the array by email
        const loggedInUser = users.find(user => user.email === loggedInEmail);
        if (loggedInUser && loggedInUser.role === 'Super Admin') {
          setIsSuperAdmin(true);
        } 
      } catch (error) {
        // console.error('Error fetching user role:', error);
      }
    };
  
    fetchUserRole();
  }, []);

  if (!isSuperAdmin) {
    return null; // Do not render the button if not a Super Admin
  }

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-maroon text-white px-4 py-2 rounded-xl hover:bg-red"
      >
        {/* Icon only on small screens */}
        <Plus className="h-4 w-4" />
        {/* Text and icon on larger screens */}
        <span className="hidden sm:inline-block ml-2">Add Admin</span> {/* Text only on sm or larger */}
      </button>

      <AddAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={onUserAdded}
      />
    </div>
  );
}