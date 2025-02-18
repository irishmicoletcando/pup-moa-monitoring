import DashboardButton from "@/components/landing-page/DashboardButton";

export default function About() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left lg:text-left sm:text-center">
            <h2 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              What does MOA Monitoring System do?
            </h2>
            <p className="text-md sm:text-md text-white/90 max-w-2xl mx-auto lg:mx-0 py-6">
              The MOA Monitoring System is an optimized platform designed to track, manage, and maintain Memorandums of Agreement (MOAs) with ease. Stay organized and ensure compliance with a seamless monitoring experience. 🚀
            </p>
            <div className = "py-7">
              <DashboardButton />
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-start -mt-20 ml-10">
            <img 
              src="/LandingIcon.png" 
              alt="MOA Monitoring" 
              className="w-full max-w-lg transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
