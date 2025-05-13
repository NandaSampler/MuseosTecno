import React, { useState, useEffect } from "react";
import "../css/ModalVisitas.css";

export default function VisitModal({
  isOpen,
  onClose,
  onSubmit,
  museums = [],
  horarios = [],
}) {
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("09:00");
  const [numVisitantes, setNumVisitantes] = useState(1);
  const [nota, setNota] = useState("");
  const [guia, setGuia] = useState(false);
  const [idioma, setIdioma] = useState("Español");
  const [museoId, setMuseoId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [minHora, setMinHora] = useState("");
  const [maxHora, setMaxHora] = useState("");
  useEffect(() => {
    if (isOpen) {
      setFecha("");
      setHora("09:00");
      setNumVisitantes(1);
      setNota("");
      setGuia(false);
      setIdioma("Español");
      setMuseoId(museums[0]?._id || "");

      const token = localStorage.getItem("token");
      const decoded = parseJwt(token);
      setUsuarioId(decoded?.id || "");
    }
  }, [isOpen, museums]);

  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!fecha) {
      setMinHora("");
      setMaxHora("");
      return;
    }
    const dias = [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
      "domingo",
    ];
    const diaSemana = dias[new Date(fecha).getDay()];
    const horario = horarios.find((h) => h.dia.toLowerCase() === diaSemana);
    if (horario && !horario.cerrado) {
      setMinHora(horario.apertura.slice(0, 5));
      setMaxHora(horario.cierre.slice(0, 5));
      if (hora < horario.apertura) setHora(horario.apertura);
      if (hora > horario.cierre) setHora(horario.apertura);
    } else {
      setMinHora("");
      setMaxHora("");
    }
  }, [fecha, horarios]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fecha_hora_visita = new Date(`${fecha}T${hora}`);
    onSubmit({
      fecha_hora_visita,
      numero_visitantes: numVisitantes,
      nota: nota.trim(),
      guia,
      idioma_guia: idioma,
      museo_id: museoId,
      usuario_id: usuarioId,
    });

    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Agendar una Visita</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Museo</label>
            <input
              type="text"
              value={museums.find((m) => m._id === museoId)?.nombre || ""}
              disabled
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-group">
            <label>Hora</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              min={minHora || undefined}
              max={maxHora || undefined}
              disabled={!minHora}
            />
            {!minHora && fecha && (
              <p className="error-text">El museo está cerrado el {fecha}.</p>
            )}
          </div>

          <div className="form-group">
            <label>Número de visitantes</label>
            <input
              type="number"
              min="1"
              value={numVisitantes}
              onChange={(e) => setNumVisitantes(+e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nota</label>
            <textarea
              className="nota-textarea"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Comentarios adicionales..."
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="guia"
              checked={guia}
              onChange={(e) => setGuia(e.target.checked)}
            />
            <label htmlFor="guia">¿Desea guía?</label>
          </div>

          <div className="form-group">
            <label>Idioma del guía</label>
            <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
              <option>Español</option>
              <option>Inglés</option>
              <option>Francés</option>
              <option>Portugués</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
