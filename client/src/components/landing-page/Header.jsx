export default function Header() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
        <img 
          src="/PUP.png" 
          alt="Polytechnic University of the Philippines logo" 
          className="h-16 sm:h-16 w-auto"
        />
        <h1 className="text-xl sm:text-xl font-semibold text-white">
          MOA Monitoring System
        </h1>
      </div>
    </header>
  );
}