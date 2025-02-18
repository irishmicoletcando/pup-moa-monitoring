import Header from "@/components/landing-page/Header";
import About from "@/components/landing-page/About";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-screen relative flex flex-col overflow-hidden">
      {/* Background for Mobile - Maroon */}
      <div className="absolute top-0 left-0 w-full h-auto min-h-screen bg-maroon lg:hidden" />

      {/* Background for Desktop */}
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
        {/* Ensure Header and About text part stay in maroon */}
        <div className="w-full bg-maroon lg:bg-transparent">
          <Header />
        </div>
        <About />
      </div>
    </div>
  );
};

