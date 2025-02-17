import Header from "@/components/landing-page/Header";
import About from "@/components/landing-page/About";

export default function LandingPage() {
  return (
    <div className="h-screen w-screen relative flex flex-col">
      {/* Background for all views (Mobile and Desktop) */}
      <svg
        className="absolute top-0 left-0 w-full h-full lg:hidden"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Top Section - Maroon */}
        <rect x="0" y="0" width="100" height="50" fill="maroon" />
        
        {/* Bottom Section - White */}
        <rect x="0" y="50" width="100" height="50" fill="white" />
      </svg>

      {/* Background for desktop */}
      <svg
        className="hidden lg:block fixed top-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Left Side - Maroon */}
        <rect x="0" y="0" width="50" height="100" fill="maroon" />
        
        {/* Right Side - White */}
        <rect x="50" y="0" width="50" height="100" fill="white" />
      </svg>

      <div className="relative z-10 flex flex-col flex-grow max-w-7xl mx-auto w-full">
        <Header />
        <About />
      </div>
    </div>
  );
};
