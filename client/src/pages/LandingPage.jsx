import Header from "@/components/landing-page/Header";
import About from "@/components/landing-page/About"; // Import the About component

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-[#800000] to-[#e57c7c] min-h-screen">
      <Header className="relative z-10"/>
      <About /> {/* Use the About component here */}
    </div>
  );
}
