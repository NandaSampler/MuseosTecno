const express = require("express");
const axios = require("axios");
const router = express.Router();

router.options("/distancias", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return res.sendStatus(200);
});

router.post("/distancias", async (req, res) => {
  try {
    const ubicaciones = req.body.ubicaciones;
    if (!ubicaciones || !Array.isArray(ubicaciones)) {
      return res.status(400).json({ error: "Ubicaciones inválidas" });
    }

    const origenes = ubicaciones.map(u => `${u.lat},${u.lng}`).join("|");
    const destinos = origenes;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origenes}&destinations=${destinos}&key=${apiKey}&units=metric`;

    const respuesta = await axios.get(url);
    res.json(respuesta.data);
  } catch (error) {
    console.error("Error en /distancias:", error.message);
    res.status(500).json({ error: "Error al obtener distancias" });
  }
});

module.exports = router;
