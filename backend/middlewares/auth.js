const jwt = require('jsonwebtoken');
const SECRET = 'tu_clave_secreta';  

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) 
    return res.status(401).json({ mensaje: 'Token no proporcionado' });

  jwt.verify(token, SECRET, (err, payload) => {
    if (err) 
      return res.status(403).json({ mensaje: 'Token inválido' });

    req.usuario = payload;
    next();
  });
}

function esAdmin(req, res, next) {
  if (req.usuario.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ mensaje: 'Acceso permitido sólo a administradores' });
}

function esSuperAdmin(req, res, next) {
  if (req.usuario.rol === 'superadmin') {
    return next();
  }
  return res.status(403).json({ mensaje: 'Acceso permitido sólo a superadministradores' });
}

module.exports = {
  verificarToken,
  esAdmin,
  esSuperAdmin,
};
