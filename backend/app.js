const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');


// Rutas de la API
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
dotenv.config();
const cors = require('cors'); // Importa el middleware CORS
const app = express();


// Middleware para permitir solicitudes desde cualquier origen
app.use(cors());

app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

db.sync()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

module.exports = app;
