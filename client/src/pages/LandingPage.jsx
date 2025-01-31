import Header from "@/components/landing-page/Header";
import About from "@/components/landing-page/About"; // Import the About component

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden font-Source-Sans-Pro bg-gradient-to-b from-[#800000] to-[#e57c7c]">
      <div className="flex flex-col justify-between flex-1 p-10">
        <Header logoStyle="h-20 mr-2" websiteNameStyle="text-white font-medium text-2xl" />
      </div>
      <About /> {/* Add the About component here */}
    </div>
  );
}