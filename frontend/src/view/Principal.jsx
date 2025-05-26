import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardMuseo from "../components/CardMuseo";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import "../css/Principal.css";

const Principal = () => {
  const { departamentoId } = useParams();
  const navigate = useNavigate();

  // Estado de museos y loading
  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Búsqueda por texto
  const [searchTerm, setSearchTerm] = useState("");

  // Favoritos del usuario
  const [favoritosUsuario, setFavoritosUsuario] = useState([]);

  // Obtener token y userId
  const token = localStorage.getItem("token");
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (e) {
      console.error("Token inválido", e);
    }
  }

  // Carga de museos
  useEffect(() => {
    const fetchMuseos = async () => {
      try {
        const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const res = await axios.get(`${API}/api/museos`);
        setMuseos(
          res.data.filter(
            (m) =>
              m.departamento_id?._id === departamentoId &&
              m.estado === "aceptado"
          )
        );
      } catch (e) {
        console.error("Error al obtener museos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMuseos();
  }, [departamentoId]);

  // Fetch favoritos del usuario
  const fetchFavoritos = async () => {
    if (!userId || !token) return;
    try {
      const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
      const res = await axios.get(`${API}/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritosUsuario(res.data.favoritos || []);
    } catch (e) {
      console.error("Error al obtener favoritos:", e);
    }
  };

  // Cargar favoritos al montar (y cuando cambie userId)
  useEffect(() => {
    fetchFavoritos();
  }, [userId]);

  if (loading) return <p>Cargando museos...</p>;
  if (!museos.length) return <p>No hay museos en este departamento.</p>;

  // Filtrado solo por nombre
  const filtered = museos.filter((m) =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="principal-container">
      {/* Barra de búsqueda */}
      <div className="search-wrapper">
        <input
          type="search"
          className="search-input"
          placeholder="Buscar museos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 className="principal-title">Museos del Departamento</h2>

      <div className="principal-grid">
        {filtered.length ? (
          filtered.map((m) => (
            <CardMuseo
              key={m._id}
              museo={m}
              favoritosUsuario={favoritosUsuario}
              actualizarFavoritos={fetchFavoritos}
            />
          ))
        ) : (
          <p>No se encontraron museos.</p>
        )}
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
