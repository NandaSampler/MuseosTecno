import React, { useState, useEffect } from "react";
import "../css/ModalComentario.css"; 

export default function ComentarioModal({ isOpen, onClose, onSubmit, museo }) {
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  const [comentario, setComentario] = useState("");
  const [valoracion, setValoracion] = useState(0);
  const [usuarioId, setUsuarioId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setComentario("");
      setValoracion(0);
      const token = localStorage.getItem("token");
      const decoded = parseJwt(token);
      setUsuarioId(decoded?.id || "");
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comentario.trim() || valoracion === 0) {
      alert("Por favor, agrega un comentario y selecciona una valoración.");
      return;
    }

    onSubmit({
      comentario: comentario.trim(),
      valoracion,
      usuario_id: usuarioId,
      museo_id: museo._id,
    });

    onClose(); 
  };
  const handleCancelar = onClose;
  const handleEnviar   = handleSubmit;
  if (!isOpen) return null;

  return (
<div className="modal-overlay">
    <div className="modal-card">
      <h3>Deja tu comentario</h3>
  <div className="valoracion-estrellas">
    {[1, 2, 3, 4, 5].map(n => (
      <span
        key={n}
        className={`estrella ${n <= valoracion ? 'activa' : ''}`}
        onClick={() => setValoracion(n)}
      >
        ★
      </span>
    ))}
  </div>
  <textarea
    value={comentario}
    onChange={(e) => setComentario(e.target.value)}
    placeholder="Escribe tu experiencia..."
  />
  <div className="modal-botones">
    <button className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
    <button className="btn-enviar" onClick={handleEnviar}>Enviar</button>
  </div>
    </div>
  </div>
  );
}
