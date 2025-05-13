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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Agregar Comentario</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Museo</label>
            <input type="text" value={museo.nombre} disabled readOnly />
          </div>

          <div className="form-group">
            <label>Valoración</label>
            <div className="valoracion-estrellas">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`estrella ${valoracion >= num ? "activa" : ""}`}
                  onClick={() => setValoracion(num)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe tu comentario..."
              required
              rows="4"
            />
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
