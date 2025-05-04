import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/CardMuseo.css";



const CardMuseo = ({ museo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/museo/${museo._id}`); // Ruta para ver el detalle del museo
  };

  return (
    <div className="card-museo" onClick={handleClick}>
      <img src={museo.foto} alt={museo.nombre} className="card-museo-img" />
      <div className="card-museo-content">
        <h3>{museo.nombre}</h3>
        <p className="card-museo-ubicacion"> {museo.ubicacion}</p>
        <p className="card-museo-descripcion">{museo.descripcion.substring(0, 100)}...</p>
        {/* Puedes mostrar parte de la historia si deseas */}
        {/* <p className="card-museo-historia">{museo.historia.substring(0, 80)}...</p> */}
      </div>
    </div>
  );
};

export default CardMuseo;
