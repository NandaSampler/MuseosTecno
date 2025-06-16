import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/CardMuseo.css';

const VerPropuestasSuperAdminView = () => {
  const [propuestas, setPropuestas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/museos/pendientes')
      .then(res => setPropuestas(res.data))
      .catch(err => console.error('Error al obtener propuestas:', err));
  }, []);

  const actualizarEstado = async (id, estado) => {
    try {
      await axios.patch(`http://localhost:4000/api/museos/${id}/estado`, {
        nuevoEstado: estado
      });
      setPropuestas(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(`Error al cambiar estado a ${estado}:`, err);
    }
  };

  if (propuestas.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        No hay propuestas pendientes.
      </div>
    );
  }

  return (
    <div className="grid-museos superadmin-view">
      {propuestas.map((museo) => (
        <div key={museo._id} className="card-museo">
          {/* cambio className para que coincida con el CSS */}
          <img
            src={
              museo.foto.startsWith('http')
                ? museo.foto
                : `http://localhost:4000/uploads/${museo.foto}`
            }
            alt={museo.nombre}
            className="card-museo-img"
          />
          {/* este bloque se oculta por CSS en superadmin-view */}
          <div className="card-museo-content">
            <h3>{museo.nombre}</h3>
            <p><strong>Ubicación:</strong> {museo.ubicacion}</p>
            <p><strong>Departamento:</strong> {museo.departamento_id?.nombre}</p>
            <p><strong>Descripción:</strong> {museo.descripcion}</p>
            <p><strong>Historia:</strong> {museo.historia}</p>
          </div>
          <div className="acciones">
            <button className="btn-aceptar" onClick={() => actualizarEstado(museo._id, 'aceptado')}>
              Aceptar
            </button>
            <button className="btn-rechazar" onClick={() => actualizarEstado(museo._id, 'rechazado')}>
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerPropuestasSuperAdminView;
