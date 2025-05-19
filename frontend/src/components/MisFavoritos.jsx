import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardMuseo from "./CardMuseo"; // Asegúrate que esté bien importado
import "../css/ComentariosUsuarios.css"; // Puedes crear uno propio si quieres

const MisFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const fetchFavoritos = async (userId, token) => {
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.favoritos) {
        setFavoritos(data.favoritos);
      } else {
        console.error("No se pudo obtener favoritos:", data);
      }
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded?.id) {
      navigate("/");
      return;
    }

    fetchFavoritos(decoded.id, token);
  }, [navigate]);

  if (loading) return <p className="cargando">Cargando favoritos...</p>;
  if (favoritos.length === 0) return <p className="sin-comentarios">Aún no has marcado museos como favoritos.</p>;

  return (
    <div className="comentarios-usuario-container">
      <h2>Mis Museos Favoritos</h2>
      <div className="principal-grid">
        {favoritos.map((museo) => (
          <CardMuseo
            key={museo._id}
            museo={museo}
            favoritosUsuario={favoritos}
          />
        ))}
      </div>
    </div>
  );
};

export default MisFavoritos;
