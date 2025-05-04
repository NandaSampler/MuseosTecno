import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/MuseoDetalle.css";

const MuseoDetalle = () => {
  const { id } = useParams();
  const [museo, setMuseo] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchMuseo = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/museos/${id}`);
        setMuseo(res.data);
      } catch (error) {
        console.error('Error al obtener el museo:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/museo-categorias`);
        const categoriasFiltradas = res.data.filter(mc => mc.museo_id._id === id);
        setCategorias(categoriasFiltradas.map(mc => mc.categoria_id.nombre));
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    const fetchHorarios = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/horarios`);
        const horariosFiltrados = res.data.filter(h => h.museo_id._id === id);
        setHorarios(horariosFiltrados);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      }
    };

    const fetchComentarios = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/comentarios`);
        const comentariosFiltrados = res.data.filter(c => c.museo_id._id === id);
        setComentarios(comentariosFiltrados);
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
      }
    };

    fetchMuseo();
    fetchCategorias();
    fetchHorarios();
    fetchComentarios();
  }, [id]);

  if (!museo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="museo-detalle-container">
      <h1 className="museo-titulo">{museo.nombre}</h1>

      <div className="museo-carrusel">
        <img src={museo.foto} alt={museo.nombre} />
      </div>

      <div className="museo-info">
        <h2>Historia</h2>
        <p>{museo.historia}</p>

        <h2>Descripción</h2>
        <p>{museo.descripcion}</p>

        <h2>Categorías</h2>
        <ul>
          {categorias.map((cat, index) => (
            <li key={index}>{cat}</li>
          ))}
        </ul>

        <h2>Horarios</h2>
        <ul>
          {horarios.map((horario, index) => (
            <li key={index}>
              {new Date(horario.dia_semana).toLocaleDateString()} - {horario.hora_apertura} a {horario.hora_cierre}
            </li>
          ))}
        </ul>

        <h2>Comentarios</h2>
        <ul>
          {comentarios.map((comentario, index) => (
            <li key={index}>
              <strong>{comentario.usuario_id.nombre}:</strong> {comentario.comentario} ({comentario.valoracion})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MuseoDetalle;
