
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate, Link } from "react-router-dom";

import Channels from "../components/Channels";
import Chat from "../components/Chat";

const socket = io("http://localhost:3000");

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState(location.state?.pseudo || "");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!pseudo) {
      navigate("/"); 
      return;
    }
    socket.on("users", (usersList) => {
      setUsers(usersList);
    });
    socket.emit("getUsers");
    return () => {
      socket.off("users");
    };
  }, [pseudo, navigate]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #6366f1 0%, #a21caf 100%)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="connexion-card" style={{ width: 400, margin: 40 }}>
          <h2 className="connexion-title">Connecté en tant que {pseudo}</h2>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Link to="/profil">
              <button className="connexion-btn">Profil</button>
            </Link>
            <Link to="/">
              <button className="connexion-btn" style={{ background: '#dc2626' }}>Déconnexion</button>
            </Link>
          </div>
          <ul className="userlist" style={{ textAlign: 'left', marginBottom: 20 }}>
            {users.map((user, idx) => (
              <li key={idx}>{user}</li>
            ))}
          </ul>
          <div style={{ marginTop: "2rem" }}>
            <Channels />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 400 }}>
        <div style={{ width: 500, maxWidth: '95vw' }}>
          <Chat />
        </div>
      </div>
    </div>
  );
}