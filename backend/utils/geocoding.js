// utils/geocoding.js
const axios = require("axios");

const obtenerCoordenadas = async (direccion) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${apiKey}`;

  const res = await axios.get(url);
  if (res.data.status === "OK") {
    const location = res.data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  } else {
    throw new Error("No se pudieron obtener coordenadas para la dirección proporcionada.");
  }
};

module.exports = obtenerCoordenadas;
