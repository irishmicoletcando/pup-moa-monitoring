export default function Logo({ logoStyle, websiteNameStyle }) {
  return (
    <div className="flex flex-col items-center mx-4 sm:flex-row sm:mx-20">
      <img 
        src="/PUP.png" 
        alt="Polytechnic University of the Philippines logo" 
        className={`mb-5 sm:mb-0 mt-2 sm:mt-0 ${logoStyle}`} 
      />
      <p className={`text-center sm:text-left sm:ml-5 text-2xl ${websiteNameStyle}`}>
        MOA Monitoring System
      </p>
    </div>
  );
}
