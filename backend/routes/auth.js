const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// Ruta para registrar un nuevo usuario
router.post(
  '/register',
  [
    // Validaciones usando express-validator
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    // Manejo de errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Verificar si el usuario ya existe en la base de datos
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Crear un nuevo usuario
      user = new User({
        username,
        email,
        password
      });

      // Encriptar la contraseña usando bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Guardar el usuario en la base de datos
      await user.save();

      // Crear un payload para el token JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      // Firmar el token JWT
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 }, // Caducidad del token (opcional)
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // Devolver el token en la respuesta
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
