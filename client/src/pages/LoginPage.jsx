import Logo from "../components/auth/Logo"
import WelcomeMessage from "../components/auth/WelcomeMessage"
import Website from "../components/auth/Website"
import LoginForm from "../components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex h-screen font-Source-Sans-Pro">
      <div className="bg-maroon flex-1 flex flex-col justify-around space-y-40">
        <Logo logoStyle="h-20 mr-2" websiteNameStyle="text-white font-medium text-2xl"/>
        <WelcomeMessage />
        <Website />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  )
}
