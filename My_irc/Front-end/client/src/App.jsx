import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Auth/login.jsx";
import Channels from "./components/Channels";
import Home from "./pages/Home.jsx";
import Profil from "./pages/Profil.jsx";
import Chat from "./components/Chat.jsx";
import "./App.css";
import { io } from "socket.io-client";
const socket = io('http://localhost:3000'); 



function App() {
  const [pseudo, setPseudo] = useState("");

  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/channels" element={<Channels  />} />
        <Route path="/profil" element={<Profil />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />

      </Routes>
    </Router>
  );
}
export default App;