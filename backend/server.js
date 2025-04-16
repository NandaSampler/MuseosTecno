require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("./db"); // Conexión a la base de datos MongoDB

// Importar todas las rutas
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

// Inicializar Express
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Log detallado de las peticiones
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} | Body: ${JSON.stringify(req.body)}`
  );
  next();
});

// Rutas
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

// Middleware de manejo global de errores
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

// Puerto
const PORT = process.env.PORT || 4000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
