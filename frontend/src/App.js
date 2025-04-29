import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './ventanas/login';
import Register from './ventanas/registrar';
import Home from './ventanas/home'; // ✅ Asegúrate que exista y esté en esa ruta

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inicio" element={<Home />} /> {/* ✅ NUEVA RUTA */}
    </Routes>
  );
}

export default App;