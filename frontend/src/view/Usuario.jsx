import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/Usuario.css";
import ComentariosUsuario from "../components/MisComentarios";
import VisitasUsuario from "../components/MisVisitas";
import MisFavoritos from "../components/MisFavoritos";

const Usuario = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userIdFromToken = decoded.id;
      setUserId(userIdFromToken);
      fetchUser(userIdFromToken, token);
    } catch (error) {
      console.error("Token inválido", error);
      navigate("/");
    }
  }, [navigate]);

  const fetchUser = async (id, token) => {
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          password: "",
        });
        setLoading(false);
      } else {
        console.error(data.error);
        navigate("/");
      }
    } catch (error) {
      console.error("Error al obtener el usuario", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Perfil actualizado con éxito");
        setEditMode(false);
      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    if (editMode) handleUpdate();
    else setEditMode(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="usuario-container">Cargando...</div>;

  return (
    <>
      <div className="nav-buttons">
  <button
    className={`sec-button perfil ${activeTab === "perfil" ? "active" : ""}`}
    onClick={() => setActiveTab("perfil")}
  >
    Perfil
  </button>
  <button
    className={`sec-button comentarios ${activeTab === "comentarios" ? "active" : ""}`}
    onClick={() => setActiveTab("comentarios")}
  >
    Comentarios
  </button>
  <button
    className={`sec-button visitas ${activeTab === "visitas" ? "active" : ""}`}
    onClick={() => setActiveTab("visitas")}
  >
    Visitas
  </button>
  <button
    className={`sec-button favoritos ${activeTab === "favoritos" ? "active" : ""}`}
    onClick={() => setActiveTab("favoritos")}
  >
    Favoritos
  </button>
</div>

      {activeTab === "perfil" && (
        <div className="usuario-container">
          <h2>Mi Perfil</h2>
          <form className="perfil-form">
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </label>
            <label>
              Apellido:
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </label>
            <label>
              Correo:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                required
              />
            </label>
            <label>
              Nueva Contraseña (opcional):
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="********"
              />
            </label>
            <button onClick={handleEditToggle} className="btn-guardar">
              {editMode ? "Guardar Cambios" : "Editar Perfil"}
            </button>
          </form>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      )}

      {activeTab === "comentarios" && <ComentariosUsuario />}
      {activeTab === "visitas" && <VisitasUsuario />}
      {activeTab === "favoritos" && <MisFavoritos />}
    </>
  );
};

export default Usuario;
