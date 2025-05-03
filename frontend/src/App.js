import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./view/login";
import Register from "./view/registrar";
import Home from "./view/home";
import Lapaz from "./view/lapaz";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inicio" element={<Home />} /> {}
      <Route path="/lapaz" element={<Lapaz />} />
    </Routes>
  );
}

export default App;
