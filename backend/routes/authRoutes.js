const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

// Middleware de validación para el registro de usuario
const validateRegister = [
  body('username', 'Username is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

// Ruta para registrar un nuevo usuario
router.post('/register', validateRegister, register);

// Ruta para iniciar sesión
router.post('/login', login);

module.exports = router;
