import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../Api/api";
import "../css/login.css"; // importa el CSS de arriba

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
    else if (password.length < 8) errs.password = "Mínimo 8 caracteres";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const isAdmin = email.toLowerCase().endsWith("@ucb.edu.bo");
    const endpoint = isAdmin
      ? `${API_URL}/api/admins/login`
      : `${API_URL}/api/usuarios/login`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Autenticación fallida");

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario || data.admin));

      Swal.fire({
        icon: "success",
        title: `¡Bienvenido, ${data.usuario?.nombre || data.admin?.nombre || "visitante"}!`,
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
    <div className="login-container">
      <div className="login-top"></div>
      <div className="login-bottom"></div>
      <div className="login-center">
        <h2>Iniciar Sesion</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={validate}
          />
          {errors.email && <div className="error">{errors.email}</div>}

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={validate}
          />
          {errors.password && <div className="error">{errors.password}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando…" : "Iniciar Sesion"}
          </button>
        </form>

        <button
          type="button"
          className="login-register-btn"
          onClick={() => navigate("/register")}
        >
          REGISTRARSE
        </button>

      </div>
    </div>
  );
}
