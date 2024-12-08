import { useLocation } from 'react-router-dom';

export default function WelcomeMessage() {
  const location = useLocation();

  return (
    <div className="mx-20">
      <h1 className="text-white text-4xl font-bold mb-4">
        {location.pathname === '/'
            ? 'Welcome PUPian!'
            : 'Welcome back PUPian!'}
      </h1>
      <p className="text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam imperdiet quam a orci aliquam tincidunt. Nullam eget lacinia est, quis iaculis risus.
      </p>
    </div>
  )
}
