import { useLocation } from 'react-router-dom';

export default function WelcomeMessage() {
  const location = useLocation();

  return (
    <div className="mx-20">
      <h1 className="text-white text-4xl font-bold mb-4 hidden sm:block">
        {location.pathname === '/'
            ? 'Welcome PUPian!'
            : 'Welcome back PUPian!'}
      </h1>
      <p className="text-white">
        Access your MOA monitoring system to track agreements, review statuses, and manage documents efficiently.
      </p>
    </div>
  )
}
