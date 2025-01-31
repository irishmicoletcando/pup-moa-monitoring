import Header from "@/components/landing-page/Header";
import About from "@/components/landing-page/About";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#800000] to-[#e57c7c] font-sans">
      <div className="max-w-7xl mx-auto">
        <Header />
        <About />
      </div>
    </div>
  );
}