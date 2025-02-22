export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 max-w-7xl mx-auto">
        <img 
          src="/PUP.png" 
          alt="PUP Logo"
          width={64}
          height={64}
          className="h-10 sm:h-16 w-auto object-contain"
          loading="eager"
        />
        <h1 className="text-base sm:text-xl font-semibold text-maroon lg:text-white">
          MOA Monitoring System
        </h1>
      </div>
    </header>
  );
};