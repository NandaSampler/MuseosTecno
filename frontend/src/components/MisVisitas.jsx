import React, { useEffect, useState } from 'react';
import '../css/VisitasUsuario.css';
import { useNavigate } from 'react-router-dom';

const VisitasUsuario = () => {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const parseJwt = token => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    const decoded = parseJwt(token);
    if (!decoded?.id) {
      navigate('/');
      return;
    }

    fetch(`http://localhost:4000/api/visitas/usuario/${decoded.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVisitas(data);
        } else {
          console.error('Formato inesperado de visitas:', data);
        }
      })
      .catch(err => console.error('Error al cargar visitas:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p className="cargando">Cargando visitas...</p>;
  if (visitas.length === 0) return <p className="sin-visitas">Aún no has registrado ninguna visita.</p>;

  return (
    <div className="visitas-container">
      <h2>Mis Visitas</h2>
      {visitas.map(v => (
        <div key={v._id} className="visita-card">
          <div className="info-header">
            <span className="museo-nombre">{v.museo_id?.nombre}</span>
            <span className="fecha">
              {new Date(v.fecha_hora_visita).toLocaleString()}
            </span>
          </div>
          <div className="detalle-visita">
            <p><strong>Visitantes:</strong> {v.numero_visitantes}</p>
            <p><strong>Guía:</strong> {v.guia ? 'Sí' : 'No'}</p>
            {v.guia && (
              <p><strong>Idioma guía:</strong> {v.idioma_guia}</p>
            )}
            {v.nota && (
              <p><strong>Nota:</strong> {v.nota}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VisitasUsuario;
