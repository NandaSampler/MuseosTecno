import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardMuseo.css";
import { jwtDecode } from "jwt-decode";

const CardMuseo = ({ museo, favoritosUsuario = [], actualizarFavoritos }) => {
  const navigate = useNavigate();

  // Obtener el token y userId
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

  // Verificar si el museo está en favoritos
  const idsFavoritos = favoritosUsuario.map(fav =>
    typeof fav === "string" ? fav : fav._id?.toString()
  );

  const [favorito, setFavorito] = useState(
    idsFavoritos.includes(museo._id?.toString())
  );

  // Navegar al detalle del museo
  const handleClick = () => {
    navigate(`/museo/${museo._id}`);
  };

  // Agregar o quitar favorito
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
        setFavorito(!nuevoEstado);
      } else {
        if (actualizarFavoritos) actualizarFavoritos(); // 🔄 Actualiza el estado global
      }
    } catch (error) {
      console.error("❌ Error de red al actualizar favoritos:", error);
      setFavorito(!nuevoEstado);
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
