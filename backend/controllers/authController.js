const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    
    // Función para registrar un nuevo usuario
    exports.register = async (req, res) => {
      const { username, email, password } = req.body;
    
      try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Crear un nuevo usuario en la base de datos
        const user = await User.create({ username, email, password: hashedPassword });
    
        res.status(201).json(user);
      } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
      }
    };
    
    // Función para iniciar sesión
    exports.login = async (req, res) => {
      const { email, password } = req.body;
    
      try {
        // Buscar al usuario por su dirección de correo electrónico
        const user = await User.findOne({ where: { email } });
    
        // Si no se encuentra el usuario o la contraseña no coincide, devolver un error de credenciales inválidas
        if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        // Si las credenciales son válidas, generar un token JWT con una caducidad de 1 hora
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        // Devolver el token como respuesta
        res.status(200).json({ token });
      } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
      }
    };
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
