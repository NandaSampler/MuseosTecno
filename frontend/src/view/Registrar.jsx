import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API_URL from "../Api/api";
import "../css/registroUsuario.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [nombre, setNombre]             = useState("");
  const [apellido, setApellido]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nombre.trim())      errs.nombre = "El nombre es requerido";
    if (!apellido.trim())    errs.apellido = "El apellido es requerido";
    if (!email)              errs.email = "El email es requerido";
    else if (!emailRegex.test(email)) errs.email = "Formato de email inválido";

    if (!password)           errs.password = "La contraseña es requerida";
    else if (password.length < 8)       errs.password = "Al menos 8 caracteres";
    else if (!/[A-Z]/.test(password))   errs.password = "Debe tener una mayúscula";
    else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
                                   errs.password = "Debe incluir un carácter especial";

    if (!confirmPassword)    errs.confirmPassword = "Debes confirmar la contraseña";
    else if (confirmPassword !== password)
                              errs.confirmPassword = "Las contraseñas no coinciden";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarte");

      localStorage.setItem("token", data.token);
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      await Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-top"></div>
      <div className="register-bottom"></div>
      <div className="register-center">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text" placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onBlur={validate}
          />
          {errors.nombre && <div className="error">{errors.nombre}</div>}

          <input
            type="text" placeholder="Apellido"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            onBlur={validate}
          />
          {errors.apellido && <div className="error">{errors.apellido}</div>}

          <input
            type="email" placeholder="Correo Electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={validate}
          />
          {errors.email && <div className="error">{errors.email}</div>}

          <input
            type="password" placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={validate}
          />
          {errors.password && <div className="error">{errors.password}</div>}

          <input
            type="password" placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            onBlur={validate}
          />
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registrando…" : "REGISTRARSE"}
          </button>
        </form>

        <p className="login-link">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/")}>Inicia Sesión</span>
        </p>
      </div>
    </div>
  );
}
