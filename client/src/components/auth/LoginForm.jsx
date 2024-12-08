import { useNavigate } from "react-router-dom"

export default function LoginForm() {
  const navigate = useNavigate();

  const handleSignUpButtonClick = () => {
    navigate("/")
  }

  return (
    <div className="m-20 w-full">
      <h2 className="text-5xl font-bold mb-4">Login</h2>
      <p className="mb-7">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam imperdiet quam a orci aliquam tincidunt. Nullam eget lacinia est, quis iaculis risus.</p>
      <form>
        <div className="mb-4">
          <label htmlFor="email" className="block font-bold mb-2">
            PUP Webmail
          </label>
          <input
            type="email"
            id="email"
            placeholder="juandelacruz@pup.edu.ph"
            className="border-gray-300 border-2 px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            className="border-gray-300 border-2 px-3 py-2 w-full"
          />
        </div>
        <div className="mb-8 flex justify-end">
          <a href="#" className="text-maroon hover:text-red-700">
            Forgot Password?
          </a>
        </div>
        <button
            type="submit"
            className="bg-maroon text-white font-bold py-2 px-4 w-full hover:bg-red-700"
          >
            Login
          </button>
        <p className="text-center mt-4">
          Don&lsquo;t have an account yet? <a onClick={handleSignUpButtonClick} className="text-maroon font-medium hover:text-red-700 hover:cursor-pointer"> Sign Up
          </a>
        </p>
      </form>
    </div>
  )
}
