import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/MuseoDetalle.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';


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
        const res = await axios.get(`http://localhost:4000/api/horarios/completos/${id}`);
        setHorarios(res.data);
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

  const renderEstrellas = (valor) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (valor >= i) {
        estrellas.push(<FontAwesomeIcon key={i} icon={solidStar} />);
      } else if (valor >= i - 0.5) {
        estrellas.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} />);
      } else {
        estrellas.push(<FontAwesomeIcon key={i} icon={emptyStar} />);
      }
    }
    return estrellas;
  };

  const promedioValoracionDecimal = comentarios.length > 0
  ? comentarios.reduce((sum, c) => sum + Number(c.valoracion || 0), 0) / comentarios.length
  : 0;


  if (!museo) return <div>Cargando...</div>;

  return (
    <>
      <div className="museo-background" />
      <div className="museo-detalle-container">
        <h1 className="museo-titulo">{museo.nombre}</h1>

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
              {renderEstrellas(promedioValoracionDecimal)} ({promedioValoracionDecimal.toFixed(1)}/5)
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

        <div className="info-bloques">
          <div className="info-bloque">
            <h3>Horarios</h3>
            <ul className="lista-horarios">
              {[
                "Lunes", "Martes", "Miércoles", "Jueves",
                "Viernes", "Sábado", "Domingo", "Feriado"
              ].map((diaOrdenado) => {
                const horario = horarios.find(h => h.dia === diaOrdenado);
                return (
                  <li key={diaOrdenado}>
                    {diaOrdenado} - {horario && !horario.cerrado ? `${horario.apertura} a ${horario.cierre}` : "Cerrado"}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="info-bloque">
            <h3>Comentarios</h3>
            <div className="comentarios-grid">
              {comentarios.map((comentario, index) => (
                <div className="comentario-card" key={index}>
                  <p className="comentario-autor">
                    {comentario.usuario_id?.nombre || 'Usuario desconocido'}
                  </p>
                  <p className="comentario-texto">{comentario.comentario}</p>
                  <div className="estrellas-box">
                    {renderEstrellas(comentario.valoracion || 0)}
                  </div>
                  <p className="comentario-fecha" style={{ fontSize: '0.85rem', color: '#666' }}>
                    {new Date(comentario.fecha_comentario).toLocaleDateString("es-ES", {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
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
