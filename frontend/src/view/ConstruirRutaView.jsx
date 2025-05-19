import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CardMuseoSeleccionable from "../components/CardMuseoSeleccionable";
import "../css/Principal.css";
import "../css/CardMuseoSeleccionable.css";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const ConstruirRutaView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const departamentoId = location.state?.departamentoId;

  const [museos, setMuseos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [mostrarRuta, setMostrarRuta] = useState(false);

  useEffect(() => {
    if (!departamentoId) {
      navigate("/inicio");
      return;
    }

    const fetchMuseos = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const res = await axios.get(`${API_URL}/api/museos`);
        const filtrados = res.data.filter(
          (m) =>
            m.estado === "aceptado" &&
            m.departamento_id?._id === departamentoId
        );
        setMuseos(filtrados);
      } catch (err) {
        console.error("Error al cargar museos:", err);
      }
    };

    fetchMuseos();
  }, [departamentoId, navigate]);

  const toggleSeleccion = (id) => {
    setMostrarRuta(false); // ocultar resultados anteriores
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const museosSeleccionados = museos.filter((m) => seleccionados.includes(m._id));
  const coordenadasRuta = museosSeleccionados
    .filter((m) => m.lat && m.lng)
    .map((m) => ({ lat: m.lat, lng: m.lng }));

  const imagenURL = (foto) =>
    foto?.startsWith("http") ? foto : `http://localhost:4000/uploads/${foto}`;

  return (
    <div className="principal-container">
      <h2 className="principal-title">Selecciona los museos de tu ruta</h2>

      <div className="principal-grid">
        {museos.map((museo) => (
          <CardMuseoSeleccionable
            key={museo._id}
            museo={museo}
            seleccionado={seleccionados.includes(museo._id)}
            toggleSeleccion={toggleSeleccion}
          />
        ))}
      </div>

      {seleccionados.length > 0 && (
        <button
          className="btn-construir-ruta"
          style={{ marginTop: "20px" }}
          onClick={() => setMostrarRuta(true)}
        >
          Generar Ruta
        </button>
      )}

      {mostrarRuta && museosSeleccionados.length > 0 && (
        <>
          <h3 className="principal-title" style={{ marginTop: "2rem" }}>
            Ruta generada
          </h3>

          <div className="principal-grid">
            {museosSeleccionados.map((m) => (
              <div key={m._id} className="card-museo-seleccionable">
                <img src={imagenURL(m.foto)} alt={m.nombre} className="card-img" />
                <div className="card-content">
                  <h3>{m.nombre}</h3>
                  <p>{m.ubicacion}</p>
                  <p>{m.descripcion?.substring(0, 80)}...</p>
                </div>
              </div>
            ))}
          </div>

          {coordenadasRuta.length > 0 && (
            <div style={{ height: "400px", marginTop: "30px" }}>
              <LoadScript googleMapsApiKey="AIzaSyBmzDDdocZW_XdO3EFp6cmPz_YakNoi2yI">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={coordenadasRuta[0]}
                  zoom={10}
                >
                  {coordenadasRuta.map((coord, idx) => (
                    <Marker key={idx} position={coord} />
                  ))}
                  <Polyline
                    path={coordenadasRuta}
                    options={{ strokeColor: "#4285F4", strokeWeight: 4 }}
                  />
                </GoogleMap>
              </LoadScript>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConstruirRutaView;
