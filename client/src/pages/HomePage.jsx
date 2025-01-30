import Navbar from "../components/layout/Navbar";
import Message from "../components/homepage/Message";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <Message />
      </div>
    </div>
  )
}
