import React from "react";

export default function Header() {
    return (
      <header className="w-full p-6 flex items-center h-40 fixed top-0 left-0 bg-transparent backdrop-blur-md z-50">
        <div className="container mx-auto flex items-center ml-10 pl-20">
          <img
            src="/PUP.png"
            alt="Logo"
            className="h-14 w-14 object-contain"
          />
          <h1 className="text-2xl text-white ml-6">MOA Monitoring System</h1>
        </div>
      </header>
    );
}
