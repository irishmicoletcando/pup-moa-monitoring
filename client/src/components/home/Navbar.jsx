import Logo from '../auth/Logo'
import { User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-3 py-3 sm:px-10 text-white text-md font-medium bg-maroon sm:shadow-md relative z-10">
      <Logo logoStyle="h-10 mr-2" pupNameStyle="text-white font-normal text-xs" websiteNameStyle="text-white font-medium text-medium"/>
      {/* Desktop Menu */}
      <ul className="hidden md:flex sm:flex-row lg:mr-10 items-center space-x-10">
          <li>
              <button className="flex px-4 py-2">
                  Dashboard
              </button>
          </li>
          <li>
              <button className="flex px-4 py-2">
                  MOAs
              </button>
          </li>
          <li>
              <button className="flex px-4 py-2">
                <User />
                <span className="ml-1">Florinda Oquindo</span>
              </button>
          </li>
      </ul>
    </nav>
  )
}
