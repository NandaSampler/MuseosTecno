import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardMuseo from "../components/CardMuseo";
import axios from "axios";
import "../css/Principal.css";


const Principal = () => {
  const { departamentoId } = useParams(); // viene de la ruta tipo /departamento/:departamentoId
  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMuseos = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const response = await axios.get(`${API_URL}/api/museos`);

        const filtrados = response.data.filter(
          (museo) => museo.departamento_id._id === departamentoId
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
    </div>
  );
};

export default Principal;
