import Logo from "../components/auth/Logo"
import WelcomeMessage from "../components/auth/WelcomeMessage"
import Website from "../components/auth/Website"
import LoginForm from "../components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-Source-Sans-Pro">
      <div className="bg-maroon flex flex-col justify-between flex-1 p-6">
        <Logo logoStyle="h-20 mr-2" websiteNameStyle="text-white font-medium text-2xl" />

        <div className="hidden md:flex">
          <WelcomeMessage />
        </div>

        <div className="md:hidden flex flex-col items-center mt-2 order-1">
          <LoginForm />
        </div>

        <div className="md:hidden flex flex-col items-center mt-6 order-2">
          <Website />
        </div>

        <div className="hidden md:flex flex-col md:order-3 order-2 mt-6">
          <Website />
        </div>

      </div>

      <div className="hidden md:flex flex-1 justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
}


