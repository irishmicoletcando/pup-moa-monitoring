import React from "react";

export default function Header() {
    return (
      <header className="w-full p-4 sm:p-6 flex items-center h-32 sm:h-40 fixed top-0 left-0 bg-transparent z-50">
        <div className="container mx-auto flex items-center px-4 sm:px-20">
          <img
            src="/PUP.png"
            alt="Logo"
            className="h-10 w-10 sm:h-14 sm:w-14 object-contain"
          />
          <h1 className="text-lg sm:text-2xl text-white ml-4 sm:ml-6">MOA Monitoring System</h1>
        </div>
      </header>
    );
}
