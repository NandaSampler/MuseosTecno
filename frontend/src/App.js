import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./view/Login";
import Register from "./view/Registrar";
import Home from "./view/Home";
import Lapaz from "./view/Lapaz";

// Componentes
import Navbar from "./components/Navbar";

function App() {
  const MainApp = () => {
    const location = useLocation();

    // Rutas sin Navbar
    const hideNavbarRoutes = ["/", "/register"];

    // Rutas con Navbar
    const showNavbar = !hideNavbarRoutes.includes(location.pathname);

    return (
      <>
        {showNavbar && <Navbar />}
        <div className="pages">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/inicio" element={<Home />} />
            <Route path="/lapaz" element={<Lapaz />} />
          </Routes>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </div>
  );
}

export default App;
