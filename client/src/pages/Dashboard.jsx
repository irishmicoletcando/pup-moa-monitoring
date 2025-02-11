import DashboardStats from "../components/dashboard/DashboardStats";
import Navbar from "../components/layout/Navbar";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <DashboardStats />
      </div>
    </div>
  )
}
