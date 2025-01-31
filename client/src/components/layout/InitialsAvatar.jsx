const InitialsAvatar = ({ firstname, lastname, role, roleStyles, size = "default" }) => {
  const getInitials = (firstname, lastname) => {
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const sizeClasses = {
    small: "w-6 h-6 text-xs",
    default: "w-10 h-10 text-sm",
    large: "w-16 h-16 text-xl"
  };

  return (
    <div
      className={`rounded-full text-white flex items-center justify-center font-bold ${sizeClasses[size]} ${roleStyles[role] || "bg-gray-500"}`}
    >
      {getInitials(firstname, lastname)}
    </div>
  );
};

export default InitialsAvatar;