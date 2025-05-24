import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/MuseoDetalle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import VisitModal from "../components/ModalAgregarVisitas";
import ComentarioModal from "../components/ModalComentarios";

const MuseoDetalle = () => {
  const { id } = useParams();
  const [museo, setMuseo] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const carruselRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ _id: payload.id, nombre: payload.nombre || payload.email });
      } catch (e) {
        console.error("Error decodificando token:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMuseo = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/museos/${id}`);
        setMuseo(res.data);
      } catch (error) {
        console.error("Error al obtener el museo:", error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/museo-categorias`
        );
        const categoriasFiltradas = res.data.filter(
          (mc) => mc?.museo_id?._id === id
        );
        setCategorias(categoriasFiltradas.map((mc) => mc.categoria_id.nombre));
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    const fetchHorarios = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/horarios/completos/${id}`
        );
        setHorarios(res.data);
      } catch (error) {
        console.error("Error al obtener los horarios:", error);
      }
    };
    fetchMuseo();
    fetchCategorias();
    fetchHorarios();
    fetchComentarios();
  }, [id]);

  const fetchComentarios = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/comentarios`);
      const comentariosFiltrados = res.data.filter(
        (mc) => mc?.museo_id?._id === id
      );
      setComentarios(comentariosFiltrados);
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
    }
  };

  const scrollCarrusel = (direction) => {
    const { current } = carruselRef;
    if (current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
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

  const promedioValoracionDecimal =
    comentarios.length > 0
      ? comentarios.reduce((sum, c) => sum + Number(c.valoracion || 0), 0) /
        comentarios.length
      : 0;

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
    "Feriado",
  ];

  // Agrupa los días por su horario de apertura y cierre
  const horariosAgrupados = {};

  diasSemana.forEach((dia) => {
    const horario = horarios.find((h) => h.dia === dia);
    const key =
      horario && !horario.cerrado
        ? `${horario.apertura.slice(0, 5)} a ${horario.cierre.slice(0, 5)}`
        : "Cerrado";

    if (!horariosAgrupados[key]) {
      horariosAgrupados[key] = [];
    }
    horariosAgrupados[key].push(dia);
  });

  // Función para formatear días agrupados (ej. "Lunes a Viernes" o "Sábado")
  const formatearDias = (dias) => {
    const indices = dias
      .map((d) => diasSemana.indexOf(d))
      .sort((a, b) => a - b);
    const rangos = [];

    for (let i = 0; i < indices.length; i++) {
      const inicio = indices[i];
      let fin = inicio;

      while (i + 1 < indices.length && indices[i + 1] === fin + 1) {
        fin = indices[++i];
      }

      if (inicio === fin) {
        rangos.push(diasSemana[inicio]);
      } else {
        rangos.push(`${diasSemana[inicio]} a ${diasSemana[fin]}`);
      }
    }

    return rangos;
  };

  const handleVisitaSubmit = async (visitaData) => {
    try {
      await axios.post("http://localhost:4000/api/visitas", visitaData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setModalOpen(false);
      await Swal.fire({
        icon: "success",
        title: "¡Visita registrada!",
        text: "Tu visita se agendó correctamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error registrando visita:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar la visita. Intenta de nuevo.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleEnviarComentario = async (datos) => {
    try {
      await axios.post("http://localhost:4000/api/comentarios", datos, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchComentarios();
      setModalOpen(false);
      await Swal.fire({
        icon: "success",
        title: "¡Comentario registrado!",
        text: "Tu comentario se registro correctamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error registrando visita:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar la visita. Intenta de nuevo.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  if (!museo) return <div>Cargando...</div>;

  return (
    <div className="detalle-museo-container">
      <div className="detalle-museo-inner">
        <h1 className="museo-titulo">{museo.nombre}</h1>
        <div className="carrusel-wrapper">
          <button
            className="carrusel-btn izquierda"
            onClick={() => scrollCarrusel("left")}
          >
            &lt;
          </button>
          <div className="museo-carrusel" ref={carruselRef}>
            {museo.galeria.map((img, i) => {
              const url = img.startsWith("http")
                ? img
                : `http://localhost:4000/uploads/${img}`;
              return (
                <img
                  key={i}
                  src={url}
                  alt={`Imagen ${i + 1}`}
                  className="museo-img"
                />
              );
            })}
          </div>
          <button
            className="carrusel-btn derecha"
            onClick={() => scrollCarrusel("right")}
          >
            &gt;
          </button>
        </div>
        <div className="info-resumen">
          <div className="info-box">
            <h3>Categorías</h3>
            <div className="categoria-chips">
              {categorias.map((cat, index) => (
                <span key={index} className="chip">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="info-box">
            <h3>Valoración</h3>
            <div className="estrellas-box">
              {renderEstrellas(promedioValoracionDecimal)} (
              {promedioValoracionDecimal.toFixed(1)}/5)
            </div>
          </div>

          <div className="info-box">
            <h3>Ubicación</h3>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                museo.ubicacion
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {museo.ubicacion}
            </a>
          </div>
        </div>

        <div className="info-box agendar-visita-box">
          <button className="boton-agendar" onClick={() => setModalOpen(true)}>
            Agendar visita
          </button>
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

        <div className="info-bloque">
          <h3>Horarios</h3>
          <ul className="lista-horarios">
            {Object.entries(horariosAgrupados).map(
              ([horario, diasAgrupados], index) =>
                formatearDias(diasAgrupados).map((rango, subIndex) => (
                  <li key={`${index}-${subIndex}`}>
                    {rango} - {horario}
                  </li>
                ))
            )}
          </ul>
        </div>

        <div className="info-bloque">
          <h3>Comentarios</h3>
          <div className="comentarios-grid">
            {comentarios.map((comentario, index) => (
              <div className="comentario-card" key={index}>
                <div className="comentario-autor">
                  <img
                    src={`https://i.pravatar.cc/150?u=${
                      comentario.usuario_id?.nombre || index
                    }`}
                    alt="Avatar"
                  />
                  <span>
                    {comentario.usuario_id?.nombre || "Usuario desconocido"}
                  </span>
                </div>

                <div className="estrellas-box">
                  {renderEstrellas(comentario.valoracion || 0)}
                </div>

                <p className="comentario-texto">{comentario.comentario}</p>

                <p
                  className="comentario-fecha"
                  style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginTop: "8px",
                  }}
                >
                  {new Date(comentario.fecha_comentario).toLocaleDateString(
                    "es-ES",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="comentario-placeholder-contenedor">
          <div
            className="comentario-card comentario-placeholder"
            onClick={() => setMostrarModal(true)}
          >
            <div className="comentario-input-fake">Agregar comentario…</div>
          </div>
        </div>
      </div>

      {user && (
        <VisitModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleVisitaSubmit}
          museums={[{ _id: id, nombre: museo.nombre }]}
          users={[user]}
          horarios={horarios}
        />
      )}
      <ComentarioModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSubmit={handleEnviarComentario}
        museo={museo}
      />
    </div>
  );
};

export default MuseoDetalle;
