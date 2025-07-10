import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const users = new Map(); 
const channels = {}; 

function broadcastGlobal(message) {
  io.emit("global_notice", message);
}

function updateChannelActivity(channelName) {
  if (!channels[channelName]) return;
  channels[channelName].lastActive = new Date();

  if (channels[channelName].timeout) clearTimeout(channels[channelName].timeout);

  // Réinitialiser :=pour supprimer le channel après 5 minutes d'inactivité
  channels[channelName].timeout = setTimeout(() => {
    delete channels[channelName];
    broadcastGlobal(`Le channel ${channelName} a été supprimé (inactivité).`);
  }, 5 * 60 * 1000); 
}

io.on("connection", (socket) => {
  
  socket.on("set_nickname", (nickname) => {
    console.log(`l'utilisateur ${nickname} vient de se connecter`);
    const old = users.get(socket.id)?.nickname || "Anonyme";
    users.set(socket.id, { ...users.get(socket.id), nickname });
    broadcastGlobal(`${old} a changé son pseudo en ${nickname}`);
  });

  socket.on("join_channel", (channelName) => {
    socket.join(channelName);
    updateChannelActivity(channelName);

    // Gestion des channels privés : ne pas broadcast globalement
    const isPrivate = channelName.startsWith('priv_');
    users.set(socket.id, { ...users.get(socket.id), channel: channelName });

    if (!channels[channelName]) {
      channels[channelName] = { lastActive: new Date(), timeout: null };
      if (!isPrivate) {
        broadcastGlobal(`Nouveau channel créé : ${channelName}`);
      }
    }

    if (isPrivate) {
      io.to(channelName).emit("local_notice", `Conversation privée ouverte.`);
    } else {
      io.to(channelName).emit("local_notice", `Un nouvel utilisateur a rejoint ${channelName}`);
    }
  });

  socket.on("send_message", ({ channel, text }) => {
    const user = users.get(socket.id);
    if (!user || user.channel !== channel) return;

    updateChannelActivity(channel);

    io.to(channel).emit("channel_message", {
      from: user.nickname,
      text,
      channel,
    });
  });

  
  socket.on("get_channels", () => {
    socket.emit("channels_list", Object.keys(channels));
  });

  socket.on("delete_channel", (channelName) => {
    if (channels[channelName]) {
      clearTimeout(channels[channelName].timeout);
      delete channels[channelName];

      broadcastGlobal(`Le channel ${channelName} a été supprimé manuellement.`);
      io.emit("channels_list", Object.keys(channels)); 
    }
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
  });
});

server.listen(3000, () => {
  console.log("Serveur Socket.IO démarré sur http://localhost:3000");
});