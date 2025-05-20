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
  const [museoOrigenId, setMuseoOrigenId] = useState(null);
  const [mostrarRuta, setMostrarRuta] = useState(false);
  const [rutaOptimizada, setRutaOptimizada] = useState([]);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

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
          (m) => m.estado === "aceptado" && m.departamento_id?._id === departamentoId
        );
        setMuseos(filtrados);
      } catch (err) {
        console.error("Error al cargar museos:", err);
      }
    };

    fetchMuseos();
  }, [departamentoId, navigate]);

  const toggleSeleccion = (id) => {
    setMostrarRuta(false);
    setRutaOptimizada([]);
    setMuseoOrigenId(null);
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const imagenURL = (foto) =>
    foto?.startsWith("http") ? foto : `http://localhost:4000/uploads/${foto}`;

  const obtenerMatrizDistancia = async (museos) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
    const ubicaciones = museos.map((m) => ({ lat: m.lat, lng: m.lng }));

    try {
      const res = await axios.post(`${API_URL}/api/maps/distancias`, { ubicaciones });
      const data = res.data;

      if (data.status !== "OK") {
        throw new Error("Error en la respuesta de la Distance Matrix API");
      }

      return data.rows.map((row) =>
        row.elements.map((el) => (el.status === "OK" ? el.distance.value : Infinity))
      );
    } catch (error) {
      console.error("❌ Error al obtener distancias:", error);
      throw error;
    }
  };

  const calcularRutaOptima = (distancias, inicio = 0) => {
    const n = distancias.length;
    const visitado = Array(n).fill(false);
    const ruta = [inicio];
    visitado[inicio] = true;

    for (let i = 1; i < n; i++) {
      let min = Infinity;
      let siguiente = -1;
      for (let j = 0; j < n; j++) {
        if (!visitado[j] && distancias[ruta[ruta.length - 1]][j] < min) {
          min = distancias[ruta[ruta.length - 1]][j];
          siguiente = j;
        }
      }
      if (siguiente !== -1) {
        ruta.push(siguiente);
        visitado[siguiente] = true;
      }
    }

    return ruta;
  };

  const generarRuta = async () => {
    try {
      const museosConCoords = museos.filter(
        (m) => seleccionados.includes(m._id) && m.lat && m.lng
      );

      if (museosConCoords.length < 2) {
        setRutaOptimizada(museosConCoords);
        setMostrarRuta(true);
        return;
      }

      const distancias = await obtenerMatrizDistancia(museosConCoords);
      const origenIndex = museoOrigenId
        ? museosConCoords.findIndex((m) => m._id === museoOrigenId)
        : 0;

      const orden = calcularRutaOptima(distancias, origenIndex);
      const rutaOrdenada = orden.map((i) => museosConCoords[i]);

      console.log("🧭 Ruta generada:", rutaOrdenada.map((m) => m.nombre));
      setRutaOptimizada(rutaOrdenada);
      setMostrarRuta(true);
    } catch (err) {
      console.error("❌ Error generando ruta óptima:", err);
    }
  };

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

      {seleccionados.length > 1 && (
        <div style={{ margin: "20px 0" }}>
          <label style={{ fontWeight: "bold" }}>Selecciona el museo de origen: </label>
          <select
            value={museoOrigenId || ""}
            onChange={(e) => setMuseoOrigenId(e.target.value)}
          >
            <option value="" disabled>
              -- Selecciona --
            </option>
            {museos
              .filter((m) => seleccionados.includes(m._id))
              .map((m) => (
                <option key={m._id} value={m._id}>
                  {m.nombre}
                </option>
              ))}
          </select>
        </div>
      )}

      {seleccionados.length > 0 && (
        <button
          className="btn-construir-ruta"
          style={{ marginTop: "10px" }}
          onClick={generarRuta}
        >
          Generar Ruta
        </button>
      )}

      {mostrarRuta && rutaOptimizada.length > 0 && (
        <>
          <h3 className="principal-title" style={{ marginTop: "2rem" }}>
            Ruta generada (óptima)
          </h3>

          <div className="principal-grid">
            {rutaOptimizada.map((m, idx) => (
              <div key={m._id} className="card-museo-seleccionable">
                <img src={imagenURL(m.foto)} alt={m.nombre} className="card-img" />
                <div className="card-content">
                  <h3>{`${idx + 1}º - ${m.nombre}`}</h3>
                  <p>{m.ubicacion}</p>
                  <p>{m.descripcion?.substring(0, 80)}...</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: "400px", marginTop: "30px" }}>
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={{
                  lat: rutaOptimizada[0].lat,
                  lng: rutaOptimizada[0].lng,
                }}
                zoom={12}
              >
                {rutaOptimizada.map((m, idx) => (
                  <Marker
                    key={idx}
                    position={{ lat: m.lat, lng: m.lng }}
                    label={`${idx + 1}`}
                    icon={
                      idx === 0
                        ? {
                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            scaledSize: { width: 40, height: 40 },
                          }
                        : undefined
                    }
                  />
                ))}
                <Polyline
                  path={rutaOptimizada.map((m) => ({ lat: m.lat, lng: m.lng }))}
                  options={{ strokeColor: "#4285F4", strokeWeight: 4 }}
                />
              </GoogleMap>
            </LoadScript>
          </div>
        </>
      )}
    </div>
  );
};

export default ConstruirRutaView;
