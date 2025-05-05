import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/MuseoDetalle.css";

const MuseoDetalle = () => {
  const { id } = useParams();
  const [museo, setMuseo] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const carruselRef = useRef(null);

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

  const scrollCarrusel = (direction) => {
    const { current } = carruselRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!museo) return <div>Cargando...</div>;

  const comentariosVisibles = comentarios.length > 0 ? comentarios : [
    {
      usuario_id: { nombre: "Ana" },
      comentario: "Muy interesante y bien conservado.",
      valoracion: 5
    },
    {
      usuario_id: { nombre: "Luis" },
      comentario: "Ideal para ir en familia, buena atención.",
      valoracion: 4
    }
  ];

  const horariosVisibles = horarios.length > 0 ? horarios : [
    { dia_semana: new Date('2023-01-02'), hora_apertura: "09:00", hora_cierre: "17:00" },
    { dia_semana: new Date('2023-01-03'), hora_apertura: "09:00", hora_cierre: "17:00" },
    { dia_semana: new Date('2023-01-04'), hora_apertura: "09:00", hora_cierre: "17:00" },
    { dia_semana: new Date('2023-01-05'), hora_apertura: "09:00", hora_cierre: "17:00" },
    { dia_semana: new Date('2023-01-06'), hora_apertura: "09:00", hora_cierre: "17:00" },
    { dia_semana: new Date('2023-01-07'), hora_apertura: "10:00", hora_cierre: "16:00" },
    { dia_semana: new Date('2023-01-08'), hora_apertura: "10:00", hora_cierre: "14:00" },
    { dia_semana: new Date('2023-12-25'), hora_apertura: "Cerrado", hora_cierre: "" }
  ];

  return (
    <>
      {/* Fondo SVG animado */}
      <div className="museo-background" />

      <div className="museo-detalle-container">
        <h1 className="museo-titulo">{museo.nombre}</h1>

        {/* Carrusel */}
        <div className="carrusel-wrapper">
          <button className="carrusel-btn izquierda" onClick={() => scrollCarrusel('left')}>&lt;</button>
          <div className="museo-carrusel" ref={carruselRef}>
            {museo.galeria && museo.galeria.length > 0 ? (
              museo.galeria.map((img, index) => {
                const isFullUrl = img.startsWith("http");
                const imageUrl = isFullUrl ? img : `http://localhost:4000/uploads/${img}`;
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Imagen ${index + 1} de ${museo.nombre}`}
                    className="museo-img"
                  />
                );
              })
            ) : (
              <p>Sin imágenes disponibles en la galería.</p>
            )}
          </div>
          <button className="carrusel-btn derecha" onClick={() => scrollCarrusel('right')}>&gt;</button>
        </div>

        {/* Categorías - Valoración - Ubicación */}
        <div className="info-resumen">
          <div className="info-box">
            <h3>Categorías</h3>
            <div className="categoria-chips">
              {categorias.map((cat, index) => (
                <span key={index} className="chip">{cat}</span>
              ))}
            </div>
          </div>

          <div className="info-box">
            <h3>Valoración</h3>
            <div className="estrellas-box">
              {'⭐'.repeat(4)}
            </div>
          </div>

          <div className="info-box">
            <h3>Ubicación</h3>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(museo.ubicacion)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {museo.ubicacion}
            </a>
          </div>
        </div>

        {/* Descripción e Historia */}
        <div className="info-bloques">
          <div className="info-bloque">
            <h3>Descripción</h3>
            <p>{museo.descripcion}</p>
          </div>

          <div className="info-bloque">
            <h3>Historia</h3>
            <p>{museo.historia}</p>
          </div>
        </div>

        {/* Horarios y Comentarios */}
        <div className="info-bloques">
          <div className="info-bloque">
            <h3>Horarios</h3>
            <ul className="lista-horarios">
              {horariosVisibles.map((horario, index) => {
                const dia = horario.dia_semana instanceof Date
                  ? horario.dia_semana
                  : new Date(horario.dia_semana);

                const diaNombre = horario.hora_apertura === "Cerrado"
                  ? "Feriado"
                  : dia.toLocaleDateString('es-ES', { weekday: 'long' });

                return (
                  <li key={index}>
                    {diaNombre} - {horario.hora_apertura} {horario.hora_cierre && `a ${horario.hora_cierre}`}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="info-bloque">
            <h3>Comentarios</h3>
            <div className="comentarios-grid">
              {comentariosVisibles.map((comentario, index) => (
                <div className="comentario-card" key={index}>
                  <p className="comentario-autor">{comentario.usuario_id.nombre}</p>
                  <p className="comentario-texto">{comentario.comentario}</p>
                  <div className="estrellas-box">
                    {'⭐'.repeat(comentario.valoracion || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MuseoDetalle;
