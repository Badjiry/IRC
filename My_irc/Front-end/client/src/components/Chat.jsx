import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import "./Chatbox.css";

export default function Chat() {
  const [nickname, setNickname] = useState("");
  const [channels, setChannels] = useState(["general"]); // Channel par défaut
  const [activeChannel, setActiveChannel] = useState("general");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState({ general: [] });
  const [users, setUsers] = useState([]);
  const messageEndRef = useRef(null);

 
  useEffect(() => {
    socket.on("global_notice", (msg) => {
      setChatLog((log) => ({ ...log, [activeChannel]: [...(log[activeChannel] || []), { from: '[GLOBAL]', text: msg }] }));
    });
    socket.on("local_notice", (msg) => {
      setChatLog((log) => ({ ...log, [activeChannel]: [...(log[activeChannel] || []), { from: '[LOCAL]', text: msg }] }));
    });
    socket.on("channel_message", ({ from, text, channel }) => {
      setChatLog((log) => ({ ...log, [channel]: [...(log[channel] || []), { from, text }] }));
    });
    socket.on("users", (userList) => {
      setUsers(userList);
    });
    socket.emit("getUsers");
    return () => {
      socket.off("global_notice");
      socket.off("local_notice");
      socket.off("channel_message");
      socket.off("users");
    };
  }, [activeChannel]);


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, activeChannel]);

  const handleSetNickname = () => {
    if (nickname.trim()) {
      socket.emit("set_nickname", nickname.trim());
    }
  };

  const handleJoinChannel = (channelName) => {
    if (channelName.trim() && !channels.includes(channelName.trim())) {
      setChannels((prev) => [...prev, channelName.trim()]);
      setActiveChannel(channelName.trim());
      socket.emit("join_channel", channelName.trim());
    } else if (channels.includes(channelName.trim())) {
      setActiveChannel(channelName.trim());
    }
  };

  const handleSendMessage = (e) => {
    // Commande /delete <channel>
    if (message.startsWith('/delete ')) {
      const channelName = message.replace('/delete', '').trim();
      if (channelName) {
        socket.emit('delete_channel', channelName);
        setChatLog((log) => ({
          ...log,
          [activeChannel]: [
            ...(log[activeChannel] || []),
            { from: '[SYSTEM]', text: `Channel "${channelName}" supprimé (si existant).` }
          ]
        }));
      }
      setMessage("");
      return;
    }
    e.preventDefault();
    if (!message.trim() || !activeChannel) return;
    if (message.startsWith('/nick ')) {
      const newNick = message.replace('/nick', '').trim();
      if (newNick) {
        socket.emit("set_nickname", newNick);
        setNickname(newNick);
        setChatLog((log) => ({
          ...log,
          [activeChannel]: [
            ...(log[activeChannel] || []),
            { from: '[SYSTEM]', text: `Vous avez changé votre pseudo en ${newNick}` }
          ]
        }));
      }
      setMessage("");
      return;
    }

    if (message.startsWith('/create ')) {
      const channelName = message.replace('/create', '').trim();
      if (channelName) {
        socket.emit('join_channel', channelName);
        setChatLog((log) => ({
          ...log,
          [activeChannel]: [
            ...(log[activeChannel] || []),
            { from: '[SYSTEM]', text: `Channel "${channelName}" créé et rejoint.` }
          ]
        }));
      }
      setMessage("");
      return;
    }
    
    if (message.startsWith('/list')) {
      const filter = message.replace('/list', '').trim();
      socket.emit('list_channels', filter, (channelsList) => {
        setChatLog((log) => ({
          ...log,
          [activeChannel]: [
            ...(log[activeChannel] || []),
            { from: '[SYSTEM]', text: `Channels${filter ? ` filtrés par "${filter}"` : ''} : ${channelsList.length ? channelsList.join(', ') : 'Aucun channel trouvé.'}` }
          ]
        }));
      });
      setMessage("");
      return;
    }
   
    socket.emit("send_message", { channel: activeChannel, text: message.trim() });
    setMessage("");
  };

  return (
    <div className="chatbox-container">
      {/* Onglets channels */}
      <div className="chatbox-tabs">
        {channels.map((ch) => (
          <button
            key={ch}
            className={`chatbox-tab${activeChannel === ch ? " active" : ""}`}
            onClick={() => setActiveChannel(ch)}
          >
            #{ch}
          </button>
        ))}
        <input
          type="text"
          placeholder="+ Nouveau channel"
          className="chatbox-tab-input"
          onKeyDown={e => {
            if (e.key === "Enter" && e.target.value.trim()) {
              handleJoinChannel(e.target.value.trim());
              e.target.value = "";
            }
          }}
        />
      </div>
      <div className="chatbox-main">
        {/* Messages */}
        <div className="chatbox-messages">
          <div className="chatbox-messages-list">
            {Array.isArray(chatLog[activeChannel]) && chatLog[activeChannel].map((msg, index) => (
              <div key={index} className="chatbox-message">
                <span className="chatbox-message-from">{msg.from}:</span> <span>{msg.text}</span>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <form className="chatbox-input-row" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chatbox-input"
              placeholder="Message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button type="submit" className="chatbox-send-btn">Envoyer</button>
          </form>
        </div>
        {/* Utilisateurs */}
        <div className="chatbox-users">
          <div className="chatbox-users-title">Utilisateurs</div>
          <ul className="chatbox-users-list">
            {users.map((u, i) => (
              <li key={i} className="chatbox-user">{u}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* Pseudo */}
      <div className="chatbox-nickname-row">
        <input
          type="text"
          placeholder="Ton pseudo"
          className="chatbox-nickname-input"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
        <button onClick={handleSetNickname} className="chatbox-nickname-btn">Changer</button>
      </div>
    </div>
  );
}