import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle, FaTimes } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import '../css/Navbar.css';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.tipo === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Token inválido');
        setIsAdmin(false);
      }
    }
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <FaBars className="menu-icon" onClick={toggleSidebar} />
          <Link to="/inicio" className="logo">Ruta Cultural</Link>
        </div>
        <div className="navbar-profile">
          <FaUserCircle size={36} color="#fff" />
        </div>
      </nav>

      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <FaTimes className="close-icon" onClick={closeSidebar} />
        </div>
        <ul className="sidebar-links">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#historia">Historia</a></li>
          <li><a href="#lugares">Lugares</a></li>
          <li><a href="#contacto">Contacto</a></li>

          {isAdmin && (
            <>
              <li><Link to="/crear-solicitud">Crear Solicitud</Link></li>
              <li><Link to="/mis-museos">Mis Museos</Link></li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
