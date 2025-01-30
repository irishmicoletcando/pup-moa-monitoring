// src/components/InitialsAvatar.jsx
const InitialsAvatar = ({ firstname, lastname, role, roleStyles }) => {
    // Function to generate initials
    const getInitials = (firstname, lastname) => {
      const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
      const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
      return `${firstInitial}${lastInitial}`;
    };
  
    return (
      <div
        className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-lg font-bold ${
          roleStyles[role] || "bg-gray-500"
        }`}
      >
        {getInitials(firstname, lastname)}
      </div>
    );
  };
  
  export default InitialsAvatar;
  