import React, { useEffect, useState } from 'react';
import '../css/ComentariosUsuarios.css';
import { useNavigate } from 'react-router-dom';

const ComentariosUsuario = () => {
  const [comentarios, setComentarios] = useState([]);
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

    fetch(`http://localhost:4000/api/comentarios/usuario/${decoded.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setComentarios(data);
        } else {
          console.error('Formato inesperado:', data);
        }
      })
      .catch(err => console.error('Error al cargar comentarios:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p className="cargando">Cargando comentarios...</p>;
  if (comentarios.length === 0) return <p className="sin-comentarios">Aún no has escrito ningún comentario.</p>;

  return (
    <div className="comentarios-usuario-container">
      <h2>Mis Comentarios</h2>
      {comentarios.map((c) => (
        <div key={c._id} className="comentario-card">
          <div className="info-header">
            <span className="museo-nombre">{c.museo_id?.nombre}</span>
            <span className="fecha">{new Date(c.fecha_comentario || c.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="valoracion">
            {[1,2,3,4,5].map(n => (
              <span key={n} className={n <= c.valoracion ? 'estrella activa' : 'estrella'}>★</span>
            ))}
          </div>
          <p className="texto">{c.comentario}</p>
        </div>
      ))}
    </div>
  );
};

export default ComentariosUsuario;
