import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [hovered, setHovered] = React.useState(null);
  const navigate = useNavigate();

  const tarjetas = [
    { titulo: "La Paz", colores: ["#e74c3c", "#387b32"], fondo: "lapaz.jpg" },
    { titulo: "Cochabamba", colores: ["#5dade2"], fondo: "cochabamba.jpg" },
    { titulo: "Santa Cruz", colores: ["#27ae60", "#fdfefe", "#27ae60"], fondo: "santacruz.jpg" },
    { titulo: "Chuquisaca", colores: ["#fdfefe", "#f90707"], fondo: "chuquisaca.jpg" },
    { titulo: "Oruro", colores: ["#f90707"], fondo: "oruro.jpeg" },
    { titulo: "Potosí", colores: ["#f90707", "#fdfefe"], fondo: "potosi.jpg" },
    { titulo: "Tarija", colores: ["#fdfefe", "#f90707"], fondo: "tarija.jpg" },
    { titulo: "Beni", colores: ["#7dcea0"], fondo: "beni.jpg" },
    { titulo: "Pando", colores: ["#fdfefe", "#2ecc71"], fondo: "pando.jpg" },
  ];

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#FFFFFF",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          width: "1500px",
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
                height: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (t.titulo === "La Paz") {
                  navigate("/lapaz");
                }
              }}
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
                  zIndex: 1,
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
                    zIndex: 2,
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
                  color: "white",
                }}
              >
                {[...t.titulo].map((char, i) => (
                  <span
                    key={i}
                    style={{
                      transition: "color 0.3s",
                      color:
                        hovered === index
                          ? t.colores[Math.floor(i / split) % t.colores.length]
                          : "white",
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
  );
};

export default Home;
