import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardMuseo.css";

const CardMuseo = ({ museo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/museo/${museo._id}`); // Navega al detalle del museo
  };

  // Si la imagen no es una URL absoluta, prepéndele el dominio local
  const imagenURL = museo.foto?.startsWith("http")
    ? museo.foto
    : `http://localhost:4000/uploads/${museo.foto}`;

  return (
    <div className="card-museo" onClick={handleClick}>
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
