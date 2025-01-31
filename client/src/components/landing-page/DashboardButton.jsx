import { useNavigate } from "react-router-dom";

export default function DashboardButton() {
  const navigate = useNavigate();

  const handleDashboardButtonClick = () => {
    navigate("/moa-dashboard");
  };

  return (
    <div>
      <button onClick={handleDashboardButtonClick}>
        Dashboard
      </button>
    </div>
  )
}
