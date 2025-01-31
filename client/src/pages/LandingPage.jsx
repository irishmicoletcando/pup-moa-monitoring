import Header from "@/components/landing-page/Header";
import About from "@/components/landing-page/About"; // Import the About component

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-[#800000] to-[#e57c7c] min-h-screen relative h-[100px]">
      <Header className="absolute top-0 left-0 w-full z-20"/>
      <About /> {/* Use the About component here */}
    </div>
  );
}