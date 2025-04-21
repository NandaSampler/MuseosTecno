import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../Api/api";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [nombre, setNombre]             = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre.trim()) {
      errs.nombre = "El nombre es requerido";
    }

    if (!email) {
      errs.email = "El email es requerido";
    } else if (!emailRegex.test(email)) {
      errs.email = "Formato de email inválido";
    }

    if (!password) {
      errs.password = "La contraseña es requerida";
    } else if (password.length < 8) {
      errs.password = "Debe tener al menos 8 caracteres";
    } else if (!/[A-Z]/.test(password)) {
      errs.password = "Debe contener al menos una letra mayúscula";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errs.password = "Debe incluir al menos un carácter especial";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Debes confirmar la contraseña";
    } else if (confirmPassword !== password) {
      errs.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarte");

      localStorage.setItem("token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: `¡Bienvenido, ${data.usuario.nombre}!`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M2 14s1-1 6-1 6 1 6 1-1-4-6-4-6 4-6 4z" />
          </svg>
        </div>
        <h2 style={styles.title}>Crear Cuenta</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={validate}
              placeholder="Nombre Completo"
              style={styles.input}
            />
            {errors.nombre && <div style={styles.error}>{errors.nombre}</div>}
          </div>

          <div style={styles.field}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validate}
              placeholder="Correo Electrónico"
              style={styles.input}
            />
            {errors.email && <div style={styles.error}>{errors.email}</div>}
          </div>

          <div style={styles.field}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validate}
              placeholder="Contraseña"
              style={styles.input}
            />
            {errors.password && (
              <div style={styles.error}>{errors.password}</div>
            )}
          </div>

          <div style={styles.field}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validate}
              placeholder="Confirmar Contraseña"
              style={styles.input}
            />
            {errors.confirmPassword && (
              <div style={styles.error}>{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "default" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Registrando…" : "REGISTRARSE"}
          </button>
        </form>

        <p style={styles.footerText}>
          ¿Ya tienes cuenta?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Inicia Sesión
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#e0f2ff",
    padding: "1rem",
  },
  card: {
    position: "relative",
    width: "320px",
    padding: "2rem 1.5rem",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.4)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  iconCircle: {
    position: "absolute",
    top: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(30, 62, 138, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginTop: "50px",
    marginBottom: "1.5rem",
    color: "#1e3a8a",
    fontFamily: "Arial, sans-serif",
  },
  field: {
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.3)",
    color: "#03396c",
    outline: "none",
  },
  error: {
    marginTop: "0.25rem",
    fontSize: "0.85rem",
    color: "#c0392b",
    textAlign: "left",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    transition: "background 0.3s",
  },
  footerText: {
    marginTop: "1.2rem",
    fontSize: "0.9rem",
    color: "#03396c",
  },
  link: {
    color: "#1e3a8a",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
