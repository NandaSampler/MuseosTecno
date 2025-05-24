import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaTimes,
  FaHome,
  FaLandmark,
  FaHistory,
  FaEnvelope,
  FaPlus,
  FaGavel,
  FaUniversity,
} from "react-icons/fa";
import "../css/Navbar.css";

// Función para decodificar JWT sin depender de jwt-decode
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    // atob en navegadores para decodificar base64
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Error al decodificar token:', e);
    return null;
  }
};

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = decodeToken(token);
    if (decoded && decoded.rol) {
      setIsAdmin(decoded.rol === "admin" || decoded.rol === "superadmin");
      setIsSuperAdmin(decoded.rol === "superadmin");
    }
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <FaBars className="menu-icon" onClick={toggleSidebar} />
          <Link to="/inicio" className="logo">
            Ruta Cultural
          </Link>
        </div>
        <div className="navbar-profile">
          <Link to="/user">
            <FaUserCircle size={36} color="#fff" style={{ cursor: "pointer" }} />
          </Link>
        </div>
      </nav>

      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <FaTimes className="close-icon" onClick={closeSidebar} />
        </div>
        <ul className="sidebar-links">
          <li>
            <Link to="/inicio" onClick={closeSidebar}>
              <FaHome /> Inicio
            </Link>
          </li>
          <li>
            <a href="#historia" onClick={closeSidebar}>
              <FaHistory /> Historia
            </a>
          </li>
          <li>
            <a href="#lugares" onClick={closeSidebar}>
              <FaLandmark /> Lugares
            </a>
          </li>
          <li>
            <a href="#contacto" onClick={closeSidebar}>
              <FaEnvelope /> Contacto
            </a>
          </li>

          {isAdmin && (
            <>
              <li>
                <Link to="/crear-solicitud" onClick={closeSidebar}>
                  <FaPlus /> Crear Solicitud
                </Link>
              </li>
              <li>
                <Link to="/mis-museos" onClick={closeSidebar}>
                  <FaUniversity /> Mis Museos
                </Link>
              </li>
            </>
          )}

          {isSuperAdmin && (
            <>
              <li>
                <Link to="/ver-propuestas" onClick={closeSidebar}>
                  <FaGavel /> Ver Propuestas
                </Link>
              </li>
              <li>
                <Link to="/superadmin/categorias/nueva" onClick={closeSidebar}>
                  <FaPlus /> Agregar Categoría
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
