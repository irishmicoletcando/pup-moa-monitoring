import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginButtonClick = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store the JWT token
      localStorage.setItem("userEmail", email); // Store the email
      toast.success("Login successful! Redirecting...", { position: "top-right" });
      setTimeout(() => navigate("/moa-dashboard"), 2000); // Navigate after 2 seconds
    } catch (err) {
      toast.error(err.message, { position: "top-right" });
    }
  };

  const handleSignUpButtonClick = () => {
    navigate("/");
  };

  return (
    <div className="m-20 w-full">
      <h2 className="text-5xl font-bold mb-4">Login</h2>
      <p className="mb-7">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam imperdiet quam a orci aliquam tincidunt.
        Nullam eget lacinia est, quis iaculis risus.
      </p>
      <form onSubmit={handleLoginButtonClick}>
        <div className="mb-4">
          <label htmlFor="email" className="block font-bold mb-2">
            PUP Webmail
          </label>
          <input
            type="email"
            id="email"
            placeholder="juandelacruz@pup.edu.ph"
            className="border-gray-300 border-2 px-3 py-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          Don&lsquo;t have an account yet?{" "}
          <a
            onClick={handleSignUpButtonClick}
            className="text-maroon font-medium hover:text-red-700 hover:cursor-pointer"
          >
            Sign Up
          </a>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}
