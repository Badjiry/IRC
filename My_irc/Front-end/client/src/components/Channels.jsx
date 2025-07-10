
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "./Channels.css"; 

const Channels = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState("");
  const [privateUser, setPrivateUser] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const refreshChannels = () => socket.emit("get_channels");
    refreshChannels();

    socket.on("channels_list", (channelList) => {
      setChannels(channelList);
    });
    socket.on("users", (userList) => {
      setUsers(userList);
    });
    socket.on("global_notice", refreshChannels);
    socket.emit("getUsers");
    return () => {
      socket.off("channels_list");
      socket.off("users");
      socket.off("global_notice", refreshChannels);
    };
  }, []);
  const handleCreatePrivate = () => {
    const user = privateUser.trim();
    if (user && users.includes(user)) {
      // Convention : nom du channel privé = user1_user2 (ordre alphabétique)
      const currentUser = window.localStorage.getItem('nickname') || "";
      const names = [currentUser, user].sort();
      const privateChannel = `priv_${names[0]}_${names[1]}`;
      socket.emit("join_channel", privateChannel);
      window.localStorage.setItem('lastChannel', privateChannel);
      setPrivateUser("");
      // Redirige vers la page du chat (ouvre l'onglet privé)
      navigate("/home");
    }
  };

  const handleJoin = (name) => {
    socket.emit("join_channel", name);
    // Pour que le chat s'ouvre automatiquement sur ce channel (public ou privé)
    window.localStorage.setItem('lastChannel', name);
  };

  const handleDelete = (name) => {
    if (window.confirm(`Supprimer le channel ${name} ?`)) {
      socket.emit("delete_channel", name);
      // La liste sera rafraîchie automatiquement via global_notice
    }
  };

  const handleCreateChannel = () => {
    const channelName = newChannel.trim();
    if (channelName) {
      socket.emit("join_channel", channelName);
      setNewChannel("");
      // La liste sera rafraîchie automatiquement via global_notice
    }
  };

  return (
    <div className="channels-container">
      <h2 className="channels-title">Liste des channels</h2>

      <div className="channel-create">
        <input
          value={newChannel}
          onChange={(e) => setNewChannel(e.target.value)}
          placeholder="Nouveau channel"
          className="channel-input"
        />
        <button
          onClick={handleCreateChannel}
          className="channel-button-create"
        >
          Créer
        </button>
      </div>

      <div className="channel-private">
        <input
          value={privateUser}
          onChange={e => setPrivateUser(e.target.value)}
          placeholder="Pseudo pour privé"
          className="channel-input"
          list="users-list"
        />
        <datalist id="users-list">
          {users.map(u => <option key={u} value={u} />)}
        </datalist>
        <button
          onClick={handleCreatePrivate}
          className="channel-button-create"
        >
          Conversation privée
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: 30 }}>
        <div style={{ flex: 2 }}>
          <ul className="channel-list">
            {channels.map((channel) => (
              <li key={channel} className="channel-item">
                <span className="channel-name">#{channel}</span>
                <div className="channel-actions">
                  <button
                    onClick={() => handleJoin(channel)}
                    className="channel-button-join"
                  >
                    Rejoindre
                  </button>
                  <button
                    onClick={() => handleDelete(channel)}
                    className="channel-button-delete"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <h3 style={{ color: '#5c3c91', fontWeight: 600, marginBottom: 10 }}>Utilisateurs connectés</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {users.map(u => (
              <li key={u} style={{ padding: '6px 0', color: '#7c3aed', fontWeight: 500 }}>{u}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Channels;