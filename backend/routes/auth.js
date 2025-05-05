const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models'); 

const SECRET = 'tu_clave_secreta';

router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, SECRET, { expiresIn: '2h' });

    res.json({ token, usuario });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
