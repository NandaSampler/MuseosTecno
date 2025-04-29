import React from "react";
import { Tabs, Tab, IconButton, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Home = () => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const tarjetas = [
    { titulo: "La Paz", colores: ["#e74c3c", "#387b32"], fondo: "lapaz.jpg" },
    { titulo: "Cochabamba", colores: ["#5dade2"], fondo: "cochabamba.jpg" },
    {
      titulo: "Santa Cruz",
      colores: ["#27ae60", "#fdfefe", "#27ae60"],
      fondo: "santacruz.jpg",
    },
    {
      titulo: "Chuquisaca",
      colores: ["#fdfefe", "#f90707"],
      fondo: "chuquisaca.jpg",
    },
    { titulo: "Oruro", colores: ["#f90707"], fondo: "oruro.jpeg" },
    { titulo: "Potosí", colores: ["#f90707", "#fdfefe"], fondo: "potosi.jpg" },
    { titulo: "Tarija", colores: ["#fdfefe", "#f90707"], fondo: "tarija.jpg" },
    { titulo: "Beni", colores: ["#7dcea0"], fondo: "beni.jpg" },
    { titulo: "Pando", colores: ["#fdfefe", "#2ecc71"], fondo: "pando.jpg" },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Collapse in={sidebarOpen} orientation="horizontal">
        <div
          style={{
            height: "100vh",
            width: "220px",
            background: "#5d4037",
            color: "#fce4ec",
            padding: "1rem",
            boxShadow: "2px 0 6px rgba(0,0,0,0.1)"
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Explora</h2>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2rem" }}>
            <li style={{ cursor: "pointer" }}>🏛 Inicio</li>
            <li style={{ cursor: "pointer" }}>🖼 Museos</li>
            <li style={{ cursor: "pointer" }}>📜 Historia</li>
            <li style={{ cursor: "pointer" }}>📞 Contacto</li>
          </ul>
        </div>
      </Collapse>

      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#8d6e63",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MenuIcon style={{ color: "#fff3e0" }} />
            </IconButton>
            <h1 style={{ marginLeft: "1rem", color: "#fff3e0" }}>
              Museos de Bolivia
            </h1>
          </div>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: "#f9a825" }}}
          >
            <Tab label="Inicio" />
            <Tab label="Museos" />
            <Tab label="Contacto" />
          </Tabs>
        </div>

        <p
          style={{ color: "#283618", marginBottom: "2rem", fontSize: "1.1rem" }}
        >
          Bolivia es un país profundamente rico en cultura, historia y tradición. Desde las civilizaciones precolombinas como Tiwanaku y los pueblos originarios andinos y amazónicos, hasta la herencia colonial que se refleja en su arquitectura, arte sacro y manifestaciones religiosas, el país es un mosaico cultural vivo.
          Los museos bolivianos, repartidos a lo largo de sus nueve departamentos, no solo resguardan objetos antiguos o pinturas famosas: cuentan historias de lucha, identidad, espiritualidad y resistencia. Visitar estos espacios es recorrer la memoria colectiva de un país que honra su pasado para construir su futuro.
          Este sitio nace con el propósito de visibilizar y conectar a las personas con estos espacios únicos. Aquí podrás explorar virtualmente los museos más representativos de cada región, aprender sobre sus piezas más emblemáticas, y sumergirte en la diversidad cultural que hace de Bolivia un verdadero tesoro andino y amazónico.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem"
          }}
        >
          {tarjetas.map((t, index) => {
            const split = Math.ceil(t.titulo.length / t.colores.length);
            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                  cursor: "pointer",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(/img/departamentos/${t.fondo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "filter 0.3s",
                    filter:
                      hovered === index ? "blur(2px) brightness(0.5)" : "none",
                    zIndex: 1
                  }}
                />

                {hovered === index && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      transition: "opacity 0.3s",
                      zIndex: 2
                    }}
                  />
                )}

                <h2
                  style={{
                    display: "flex",
                    gap: "0.2rem",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    margin: 0,
                    zIndex: 3,
                    color: "white"
                  }}
                >
                  {[...t.titulo].map((char, i) => (
                    <span
                      key={i}
                      style={{
                        transition: "color 0.3s",
                        color:
                          hovered === index
                            ? t.colores[
                                Math.floor(i / split) % t.colores.length
                              ]
                            : "white"
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;