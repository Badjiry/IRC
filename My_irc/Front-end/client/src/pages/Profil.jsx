
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../socket";
import LogoutButton from "../components/logout";

export default function Profil() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.pseudo || "Utilisateur";
  const [pseudoActuel, setPseudoActuel] = useState(username);
  const [newPseudo, setNewPseudo] = useState("");
  const [logoutMsg, setLogoutMsg] = useState("");

  const handleChangePseudo = () => {
    if (newPseudo.trim()) {
      socket.emit("set_nickname", newPseudo.trim());
      setPseudoActuel(newPseudo.trim());
      setNewPseudo("");
      navigate('/home', { state: { pseudo: newPseudo.trim() } });
    }
  };

  const handleLogout = () => {
    setLogoutMsg("Vous avez été déconnecté. À bientôt !");
    setTimeout(() => {
      socket.disconnect();
      navigate("/");
    }, 1500);
  };


  return (
    <div className="connexion-container">
      <div className="connexion-card">
        <h2 className="connexion-title">👤 Mon Profil</h2>
        <div style={{ marginBottom: "1.5rem", color: "#555", fontWeight: 500 }}>
          Pseudo actuel : <span style={{ color: "#7c3aed", fontWeight: 700 }}>{pseudoActuel}</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Nouveau pseudo"
            className="connexion-input"
            value={newPseudo}
            onChange={(e) => setNewPseudo(e.target.value)}
          />
          <button onClick={handleChangePseudo} className="connexion-btn" style={{ marginBottom: 10 }}>
            Modifier
          </button>
        </div>
        {logoutMsg && (
          <div style={{ marginTop: 20, color: 'green', fontWeight: 'bold' }}>{logoutMsg}</div>
        )}
        <LogoutButton />
      </div>
    </div>
  );
}