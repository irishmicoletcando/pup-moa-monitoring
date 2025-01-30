import Navbar from "../components/layout/Navbar";
import Logo from "../components/homepage/Logo"
import Message from "../components/homepage/Message";

export default function HomePage() {
    return (
        <div className="flex h-screen overflow-hidden">
          <Navbar />
          <div className="flex-1 flex flex-col justify-center items-center font-Source-Sans-Pro text-center">
            <div className="flex flex-col items-center">
              <div className="p-20">
                <Logo logoStyle="h-20 mb-4" />
              </div>
              <Message />
            </div>
          </div>
        </div>
    );
}