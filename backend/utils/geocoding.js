// utils/geocoding.js
const axios = require("axios");

const obtenerCoordenadas = async (ubicacion) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // antes tenías `${encodeURIComponent(direccion)}` → aquí debe ser `ubicacion`
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(ubicacion)}&key=${apiKey}`;

  const res = await axios.get(url);
  if (res.data.status === "OK") {
    const { lat, lng } = res.data.results[0].geometry.location;
    return { lat, lng };
  }
  throw new Error("No se pudieron obtener coordenadas para la dirección proporcionada.");
};

module.exports = obtenerCoordenadas;
