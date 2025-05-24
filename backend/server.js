require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
require("./db"); // Conexión a MongoDB

const app = express(); // ✅ Primero se crea la instancia de Express

// ✅ Configuración de CORS (antes de rutas)
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Servir archivos estáticos desde /uploads
app.use("/uploads", express.static("uploads"));

// ✅ Log detallado para debugging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} | Body: ${JSON.stringify(req.body)}`
  );
  next();
});

// ✅ Ruta especial para la Distance Matrix API
const mapsRoute = require("./utils/mapsRoute");
app.use("/api/maps", mapsRoute);

// ✅ Importar y usar todas las rutas
const usuarioRoutes = require("./routes/usuarioRoute");
const adminRoutes = require("./routes/adminRoute");
const dptoRoutes = require("./routes/dptoRoute");
const museoRoutes = require("./routes/museoRoute");
const categoriaRoutes = require("./routes/categoriaRoute");
const comentarioRoutes = require("./routes/comentarioRoute");
const horarioRoutes = require("./routes/horarioRoute");
const visitaRoutes = require("./routes/visitaRoute");
const museoCategoriaRoutes = require("./routes/museoCategoriaRoute");
const auditoriaRoutes = require("./routes/auditoriaRoute");

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/departamentos", dptoRoutes);
app.use("/api/museos", museoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/comentarios", comentarioRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/visitas", visitaRoutes);
app.use("/api/museo-categorias", museoCategoriaRoutes);
app.use("/api/auditorias", auditoriaRoutes);

// ✅ Middleware global de errores
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

// ✅ Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
