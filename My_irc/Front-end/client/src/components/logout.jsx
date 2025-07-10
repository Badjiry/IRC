import { useNavigate } from "react-router-dom";
import socket from "../socket";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    socket.disconnect();
    navigate("/");
  };

  return (
    <button className="connexion-btn" style={{ background: "#dc2626" }} onClick={handleLogout}>
      🔌 Se déconnecter
    </button>
  );
}