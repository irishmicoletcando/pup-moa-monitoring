import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/moa-dashboard", { replace: true }); // Redirect to dashboard
    }
  }, [navigate]);

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
      localStorage.setItem("user_id", data.user_id); // Store the user ID
      localStorage.setItem("userEmail", email); // Store the email
      localStorage.setItem("firstname", data.firstname); // Store the first name
      localStorage.setItem("lastname", data.lastname); // Store the last name
      localStorage.setItem("role", data.role); // Store the role
      localStorage.setItem("lastLogin", data.lastLogin); // Store last login time if needed
      localStorage.setItem("accessOtherMoa", data.accessOtherMoa);
      toast.success("Login successful! Redirecting...", { position: "top-right" });
      setTimeout(() => navigate("/landing-page"), 2000); // Navigate after 2 seconds
    } catch (err) {
      toast.error(err.message, { position: "top-right" });
    }
  };  

  return (
    <div className="m-5 md:m-20 w-full">
      <h2 className="text-5xl font-bold mb-4 text-white md:text-black text-center md:text-left hidden sm:block">
        Login
      </h2>

      <p className="mb-7 text-white md:text-black text-center md:text-left hidden sm:block">
        Stay informed and organized with our MOA Monitoring System. Track agreements, deadlines, and progress effortlessly.
      </p>

      <form
        onSubmit={handleLoginButtonClick}
        className="bg-white md:bg-transparent md:border-none p-8 md:p-0 border-2 border-gray-300 rounded-lg md:rounded-none mx-auto w-full max-w-4xl"
      >

        <div className="mb-4">
          <label htmlFor="email" className="block font-bold mb-2 text-xl md:text-base">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="juandelacruz@pup.edu.ph"
            className="border-gray-300 border-2 px-3 py-2 w-full text-lg md:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block font-bold mb-2 text-xl md:text-base">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            className="border-gray-300 border-2 px-3 py-2 w-full text-lg md:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* <div className="mb-8 flex justify-end hidden">
          <a href="#" className="text-maroon hover:text-red-700 text-lg md:text-base">
            Forgot Password?
          </a>
        </div> */}

        <button
          type="submit"
          className="font-bold mt-5 w-full hover:bg-red-700 text-lg md:text-base
                    inline-flex items-center justify-center gap-2 
                    bg-maroon text-white 
                    px-3 py-2 rounded-md
                    shadow-sm
                    hover:bg-red hover:shadow-md
                    active:bg-maroon active:scale-95
                    transition-all duration-200 ease-in-out
                    border border-maroon
                    focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-2"
        >
          Login
        </button>

        {/* <p className="text-center mt-4">
          Don&lsquo;t have an account yet?{" "}
          <a
            onClick={handleSignUpButtonClick}
            className="text-maroon font-medium hover:text-red-700 hover:cursor-pointer"
          >
            Sign Up
          </a>
        </p> */}

      </form>

      <ToastContainer />

    </div>
  );  
}
