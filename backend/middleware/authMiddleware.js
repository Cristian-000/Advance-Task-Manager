const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar el token JWT y proteger las rutas
exports.protect = async (req, res, next) => {
  let token;

  // Verificar si hay un token en el encabezado Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer el token de la cabecera Authorization
      token = req.headers.authorization.split(' ')[1];

      // Verificar y decodificar el token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar al usuario en la base de datos usando el ID del usuario codificado en el token
      req.user = await User.findByPk(decoded.userId);

      // Llamar a la siguiente función de middleware
      next();
    } catch (error) {
      // Manejar el error si el token no es válido
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Manejar el caso donde no se proporciona un token válido
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
