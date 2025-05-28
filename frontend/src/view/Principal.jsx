import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardMuseo from "../components/CardMuseo";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import "../css/Principal.css";

const Principal = () => {
  const { departamentoId } = useParams();
  const navigate = useNavigate();

  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritosUsuario, setFavoritosUsuario] = useState([]);

  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

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

  useEffect(() => {
    const fetchMuseos = async () => {
      try {
        const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const res = await axios.get(`${API}/api/museos`);
        const filtrados = res.data.filter(
          (m) =>
            m.departamento_id?._id === departamentoId &&
            m.estado === "aceptado"
        );
        setMuseos(filtrados);
      } catch (e) {
        console.error("Error al obtener museos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMuseos();
  }, [departamentoId]);

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

  useEffect(() => {
    fetchFavoritos();
  }, [userId]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
        const res = await axios.get(`${API}/api/categorias`);
        setCategorias(res.data);
      } catch (e) {
        console.error("Error al obtener categorías:", e);
      }
    };
    fetchCategorias();
  }, []);

  const toggleCategoria = (categoriaId) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoriaId)
        ? prev.filter((id) => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  if (loading) return <p>Cargando museos...</p>;
  if (!museos.length) return <p>No hay museos en este departamento.</p>;

  const filtered = museos.filter((m) => {
    const coincideBusqueda = m.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const coincideCategoria =
      categoriasSeleccionadas.length === 0 ||
      (m.categorias &&
        m.categorias.some((nombreCat) =>
          categorias
            .filter((c) => categoriasSeleccionadas.includes(c._id))
            .map((c) => c.nombre)
            .includes(nombreCat)
        ));

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="principal-container">
      {/* Título principal antes de buscador */}
      <h2 className="principal-title">Destinos culturales y turísticos del departamento</h2>

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

      {/* Filtro de categorías */}
      <div className="filtros-categorias">
        <div className="checkboxes-categorias">
          {categorias.map((cat) => {
            const activa = categoriasSeleccionadas.includes(cat._id);
            return (
              <div
                key={cat._id}
                className={`categoria-checkbox ${activa ? "active" : ""}`}
                onClick={() => toggleCategoria(cat._id)}
              >
                {cat.nombre}
              </div>
            );
          })}

          {categoriasSeleccionadas.length > 0 && (
            <button
              className="btn-limpiar-filtros"
              onClick={() => setCategoriasSeleccionadas([])}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tarjetas de museos */}
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
