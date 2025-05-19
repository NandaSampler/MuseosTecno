import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardMuseo from "../components/CardMuseo";
import axios from "axios";
import "../css/Principal.css";

const Principal = () => {
  const { departamentoId } = useParams();
  const navigate = useNavigate();
  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMuseos = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const response = await axios.get(`${API_URL}/api/museos`);

        const filtrados = response.data.filter(
          (museo) =>
            museo.departamento_id?._id === departamentoId &&
            museo.estado === "aceptado"
        );
        setMuseos(filtrados);
      } catch (error) {
        console.error("Error al obtener los museos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMuseos();
  }, [departamentoId]);

  if (loading) return <p>Cargando museos...</p>;
  if (museos.length === 0) return <p>No hay museos en este departamento.</p>;

  return (
    <div className="principal-container">
      <h2 className="principal-title">Museos del Departamento</h2>

      <div className="principal-grid">
        {museos.map((museo) => (
          <CardMuseo key={museo._id} museo={museo} />
        ))}
      </div>

      <button
        className="btn-construir-ruta"
        onClick={() => navigate("/construir-ruta", { state: { departamentoId } })}
      >
        Construye tu ruta
      </button>

    </div>
  );
};

export default Principal;
