import DashboardButton from "@/components/landing-page/DashboardButton";

export default function About() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              What does MOA Monitoring System do?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0">
              The MOA Monitoring System is an optimized platform designed to track, manage, and maintain Memorandums of Agreement (MOAs) with ease. Stay organized and ensure compliance with a seamless monitoring experience. 🚀
            </p>
            <DashboardButton />
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <img 
              src="/Landing.png" 
              alt="MOA Monitoring" 
              className="w-full max-w-lg transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
