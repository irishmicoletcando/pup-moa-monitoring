import DashboardButton from "@/components/landing-page/DashboardButton";

export default function About() {
  return (
    <div className="flex justify-between items-center min-h-screen px-8"> {/* Added px-8 for padding on the sides */}
      {/* Left Side */}
      <div className="bg-yellow flex flex-col justify-center w-1/2 h-full space-y-10 ml-12 p-20"> {/* Added h-full for same height */}
        <h2 className="text-5xl font-bold text-white">
          What does MOA Monitoring System do?
        </h2>
        <p className="text-lg text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam imperdiet quam a orci aliquam tincidunt. Nullam eget lacinia est, quis iaculis risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <DashboardButton />
      </div>

      {/* Right Side */}
      <div className="bg-white flex justify-center items-center w-1/2 h-full mr-12"> {/* Added h-full for same height */}
        <img 
          src="/Landing.png" 
          alt="MOA Monitoring" 
          className="w-auto h-90 object-cover rounded-lg" 
        />
      </div>
    </div>
  );
}
