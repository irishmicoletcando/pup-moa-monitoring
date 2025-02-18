export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row items-center justify-start gap-4 p-7 ml-2 sm:p-0 ml-0">
        <img 
          src="/PUP.png" 
          alt="Polytechnic University of the Philippines logo" 
          className="h-10 sm:h-16 w-auto"
        />
        <h1 className="text-md sm:text-xl font-semibold text-white">
          MOA Monitoring System
        </h1>
      </div>
    </header>
  );
};
