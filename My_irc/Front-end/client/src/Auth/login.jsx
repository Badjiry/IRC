
import { useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000");

export default function Login({ onLogin }) {
  const [nickname, setNickname] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (nickname.trim() === "") {
      setErrorMsg("Veuillez entrer un pseudo");
      return;
    }
    socket.emit("set_nickname", nickname);
    if (onLogin) onLogin(nickname);
    navigate("/home", { state: { pseudo: nickname } });
  };

  return (
    <div className="connexion-container">
      <form onSubmit={handleLogin} className="connexion-card">
        <h2 className="connexion-title">Connexion</h2>
        {errorMsg && <div className="connexion-error">{errorMsg}</div>}
        <input
          type="text"
          placeholder="Pseudo"
          className="connexion-input"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <button type="submit" className="connexion-btn">
          Se connecter
        </button>
      </form>
    </div>
  );
}