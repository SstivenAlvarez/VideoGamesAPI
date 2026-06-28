require('dotenv').config();

const express      = require('express');
const authRoutes   = require('./routes/auth.routes');
const studiosRoutes = require('./routes/studios.routes');
const gamesRoutes  = require('./routes/games.routes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/studios', studiosRoutes);
app.use('/api/games',   gamesRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});
