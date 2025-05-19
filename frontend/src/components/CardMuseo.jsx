import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardMuseo.css";
import { jwtDecode } from "jwt-decode";

const CardMuseo = ({ museo, favoritosUsuario = [] }) => {
  const navigate = useNavigate();
  const [favorito, setFavorito] = useState(false);
  const token = localStorage.getItem("token");
  let userId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (e) {
      console.error("Token inválido");
    }
  }

  // ✅ Verifica si este museo está en favoritosUsuario
  useEffect(() => {
    const idsFavoritos = favoritosUsuario.map(fav =>
      typeof fav === "string" ? fav : fav._id?.toString()
    );
    setFavorito(idsFavoritos.includes(museo._id?.toString()));
  }, [favoritosUsuario, museo._id]);

  const handleClick = () => {
    navigate(`/museo/${museo._id}`);
  };

  const toggleFavorito = async (e) => {
    e.stopPropagation();
    const nuevoEstado = !favorito;
    setFavorito(nuevoEstado);

    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${userId}/favoritos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ museoId: museo._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Error al actualizar favoritos:", data.error || data.message);
        setFavorito(!nuevoEstado); // revertir si falla
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      setFavorito(!nuevoEstado); // revertir si hay error
    }
  };

  const imagenURL = museo.foto?.startsWith("http")
    ? museo.foto
    : `http://localhost:4000/uploads/${museo.foto}`;

  return (
    <div className="card-museo" onClick={handleClick}>
      <div className="estrella-icono" onClick={toggleFavorito}>
        {favorito ? "★" : "☆"}
      </div>
      <img src={imagenURL} alt={museo.nombre} className="card-museo-img" />
      <div className="card-museo-content">
        <h3>{museo.nombre}</h3>
        <p className="card-museo-ubicacion">{museo.ubicacion}</p>
        <p className="card-museo-descripcion">
          {museo.descripcion?.substring(0, 100)}...
        </p>
      </div>
    </div>
  );
};

export default CardMuseo;
