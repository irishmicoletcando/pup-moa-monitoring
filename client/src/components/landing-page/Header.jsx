import React from "react";

export default function Header() {
    return (
      <header className="w-full shadow-md p-6 flex items-center h-40">
        <div className="container mx-auto flex items-center ml-12 pl-20">
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
