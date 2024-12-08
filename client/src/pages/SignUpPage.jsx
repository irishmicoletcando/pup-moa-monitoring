import Logo from "../components/auth/Logo"
import WelcomeMessage from "../components/auth/WelcomeMessage"
import SignUpForm from "../components/auth/SignUpForm"
import Website from "../components/auth/Website"

export default function SignUpPage() {
  return (
    <div className="flex h-screen font-Source-Sans-Pro">
      <div className="bg-maroon flex-1 flex flex-col justify-around space-y-40">
        <Logo />
        <WelcomeMessage />
        <Website />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <SignUpForm />
      </div>
    </div>
  )
}
