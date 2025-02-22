import DashboardButton from "@/components/landing-page/DashboardButton";

export default function About() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Mobile Image */}
          <div className="block lg:hidden">
            <img 
              src="/LandingIcon.png" 
              alt="MOA Monitoring"
              width={320}
              height={320}
              className="w-4/5 max-w-xs mx-auto transform scale-110"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-maroon lg:text-white leading-tight">
              What does MOA Monitoring System do?
            </h2>
            <p className="text-base sm:text-lg text-maroon/90 lg:text-white/90 max-w-2xl mx-auto lg:mx-0">
              The MOA Monitoring System is an optimized platform designed to track, manage, and maintain 
              Memorandums of Agreement (MOAs) with ease. Stay organized and ensure compliance with a 
              seamless monitoring experience. 🚀
            </p>
            <div className="pt-4 sm:pt-6">
              <DashboardButton />
            </div>
          </div>

          {/* Desktop Image */}
          <div className="hidden lg:block">
            <img 
              src="/LandingIcon.png" 
              alt="MOA Monitoring"
              width={512}
              height={512}
              className="w-full max-w-lg mx-auto transform transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};