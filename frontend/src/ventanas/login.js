import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../Api/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) errs.email = "El email es requerido";
    else if (!emailRegex.test(email)) errs.email = "Formato de email inválido";
    if (!password) errs.password = "La contraseña es requerida";
    else if (password.length < 6) errs.password = "Mínimo 6 caracteres";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Autenticación fallida");

      localStorage.setItem("token", data.token);
      if (data.refreshToken)
        localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      Swal.fire({
        icon: "success",
        title: `¡Bienvenido, ${data.usuario.nombre || "visitante"}!`,
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/inicio");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
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
            <path
              fillRule="evenodd"
              d="M8 9a5 5 0 0 0-4.546 2.916.5.5 0 1 0 .868.496A4 4 0 0 1 8 10a4 4 0 0 1 3.678 2.412.5.5 0 1 0 .868-.496A5 5 0 0 0 8 9z"
            />
          </svg>
        </div>
        <h2 style={styles.title}>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validate}
              placeholder="Correo Electronico"
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

          <div style={styles.rememberRow}>
            <label style={styles.remember}>
              <input type="checkbox" style={styles.checkbox} /> Recordar Contraseña
            </label>
            <span
              style={styles.forgot}
              onClick={() => navigate("/register")}
            >
              Aun no te registraste?
            </span>
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
            {loading ? "Entrando…" : "LOGIN"}
          </button>
        </form>
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
    background: "rgba(30, 62, 138,1)",
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
  rememberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    color: "#03396c",
    marginBottom: "1.5rem",
  },
  remember: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
  },
  forgot: {
    textDecoration: "underline",
    cursor: "pointer",
    color: "#1e3a8a",
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
};