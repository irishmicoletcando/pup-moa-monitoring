import DashboardButton from "@/components/landing-page/DashboardButton";

export default function About() {
  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center min-h-screen px-6 md:px-8">

      <div className="flex flex-col justify-center w-full md:w-1/2 h-screen md:h-full space-y-4 md:space-y-8 p-8 md:p-16">
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white text-left">
          What does MOA Monitoring System do?
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-white text-left">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam imperdiet quam a orci aliquam tincidunt. Nullam eget lacinia est, quis iaculis risus.
        </p>
        <div className="flex justify-start">
          <DashboardButton />
        </div>
      </div>

      <div className="hidden md:flex justify-center items-center w-1/2 h-full">
        <img 
          src="/Landing.png" 
          alt="MOA Monitoring" 
          className="w-3/4 max-w-lg h-auto object-cover rounded-lg" 
        />
      </div>
    </div>
  );
}
