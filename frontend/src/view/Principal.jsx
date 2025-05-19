import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardMuseo from "../components/CardMuseo";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../css/Principal.css";

const Principal = () => {
  const { departamentoId } = useParams();
  const navigate = useNavigate();
  const [museos, setMuseos] = useState([]);
  const [favoritosUsuario, setFavoritosUsuario] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  let userId = "";

  // Obtener userId desde el token
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (e) {
      console.error("Token inválido");
    }
  }

  // Cargar museos
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

  // Cargar favoritos del usuario
  const fetchFavoritos = async () => {
    if (!userId || !token) return;
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
      const response = await axios.get(`${API_URL}/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritosUsuario(response.data.favoritos || []);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
    }
  };

  // Cargar favoritos al iniciar
  useEffect(() => {
    fetchFavoritos();
  }, [userId]);

  if (loading) return <p>Cargando museos...</p>;
  if (museos.length === 0) return <p>No hay museos en este departamento.</p>;

  return (
    <div className="principal-container">
      <h2 className="principal-title">Museos del Departamento</h2>

      <div className="principal-grid">
        {museos.map((museo) => (
          <CardMuseo
            key={museo._id}
            museo={museo}
            favoritosUsuario={favoritosUsuario}
            actualizarFavoritos={fetchFavoritos} // 🔄 Actualiza desde hijo
          />
        ))}
      </div>

      <button
        className="btn-construir-ruta"
        onClick={() =>
          navigate("/construir-ruta", { state: { departamentoId } })
        }
      >
        Construye tu ruta
      </button>
    </div>
  );
};

export default Principal;
