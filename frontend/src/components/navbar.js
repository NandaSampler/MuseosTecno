import React from 'react';

const Navbar = () => {
    return (
        <nav style={styles.nav}>
          <h1 style={styles.logo}>La Paz</h1>
          <ul style={styles.navLinks}>
            <li><a href="#inicio" style={styles.link}>Inicio</a></li>
            <li><a href="#historia" style={styles.link}>Historia</a></li>
            <li><a href="#lugares" style={styles.link}>Lugares</a></li>
            <li><a href="#contacto" style={styles.link}>Contacto</a></li>
          </ul>
        </nav>
      );
    };

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: '10px 20px',
  },
  logo: {
    color: '#fff',
    margin: 0,
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  }
};

export default Navbar;
