import Logo from "../components/auth/Logo"
import WelcomeMessage from "../components/auth/WelcomeMessage"
import Website from "../components/auth/Website"
import LoginForm from "../components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-Source-Sans-Pro">
      {/* Left Section (Logo, Website) */}
      <div className="bg-maroon flex flex-col justify-between flex-1 p-6">
        <Logo logoStyle="h-20 mr-2" websiteNameStyle="text-white font-medium text-2xl" />

        {/* Conditionally render WelcomeMessage only on larger screens */}
        <div className="hidden md:flex">
          <WelcomeMessage />
        </div>

        {/* Show LoginForm first on mobile and Website below it */}
        <div className="md:hidden flex flex-col items-center mt-2 order-1">
          <LoginForm />
        </div>

        {/* Website component placed below LoginForm on mobile and in original order on desktop */}
        <div className="md:hidden flex flex-col items-center mt-6 order-2">
          <Website />
        </div>

        {/* On desktop, the Website should behave as it originally did (below the WelcomeMessage) */}
        <div className="hidden md:flex flex-col md:order-3 order-2 mt-6">
          <Website />
        </div>

      </div>

      {/* Right Section (LoginForm - only on larger screens) */}
      <div className="hidden md:flex flex-1 justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
}


