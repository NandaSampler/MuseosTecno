import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
  const [hovered, setHovered] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/departamentos");
        setDepartamentos(res.data);
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, []);

  const imagenes = {
    "La Paz": "lapaz.jpg",
    "Cochabamba": "cochabamba.jpg",
    "Santa Cruz": "santacruz.jpg",
    "Chuquisaca": "chuquisaca.jpg",
    "Oruro": "oruro.jpeg",
    "Potosí": "potosi.jpg",
    "Tarija": "tarija.jpg",
    "Beni": "beni.jpg",
    "Pando": "pando.jpg",
  };

  const colores = {
    "La Paz": ["#e74c3c", "#387b32"],
    "Cochabamba": ["#5dade2"],
    "Santa Cruz": ["#27ae60", "#fdfefe", "#27ae60"],
    "Chuquisaca": ["#fdfefe", "#f90707"],
    "Oruro": ["#f90707"],
    "Potosí": ["#f90707", "#fdfefe"],
    "Tarija": ["#fdfefe", "#f90707"],
    "Beni": ["#7dcea0"],
    "Pando": ["#fdfefe", "#2ecc71"],
  };

  return (
    <div className="home-container">
      <div className="grid-container">
        {departamentos.map((dpto, index) => {
          const nombre = dpto.nombre;
          const fondo = imagenes[nombre] || "default.jpg";
          const coloresTexto = colores[nombre] || ["white"];
          const split = Math.ceil(nombre.length / coloresTexto.length);

          return (
            <div
              key={dpto._id}
              className="card"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(`/departamento/${dpto._id}`)}
            >
              <div
                className="card-background"
                style={{
                  backgroundImage: `url(/img/departamentos/${fondo})`,
                  filter:
                    hovered === index ? "blur(2px) brightness(0.5)" : "none",
                }}
              />
              {hovered === index && <div className="card-overlay" />}
              <h2 className="card-title">
                {[...nombre].map((char, i) => (
                  <span
                    key={i}
                    style={{
                      transition: "color 0.3s",
                      color:
                        hovered === index
                          ? coloresTexto[Math.floor(i / split) % coloresTexto.length]
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
