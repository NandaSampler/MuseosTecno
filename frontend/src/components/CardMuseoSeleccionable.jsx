import React from "react";
import "../css/CardMuseoSeleccionable.css";

const CardMuseoSeleccionable = ({ museo, seleccionado, toggleSeleccion }) => {
  const imagenURL = museo.foto?.startsWith("http")
    ? museo.foto
    : `http://localhost:4000/uploads/${museo.foto}`;

  return (
    <div
      className={`card-museo-seleccionable ${seleccionado ? "seleccionado" : ""}`}
      onClick={() => toggleSeleccion(museo._id)}
    >
      <img src={imagenURL} alt={museo.nombre} className="card-img" />
      <div className="card-content">
        <h3>{museo.nombre}</h3>
        <p className="ubicacion">{museo.ubicacion}</p>
        <div className="check-overlay">
          <input type="checkbox" checked={seleccionado} readOnly />
        </div>
      </div>
    </div>
  );
};

export default CardMuseoSeleccionable;
