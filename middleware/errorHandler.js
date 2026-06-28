
function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message);

  // Error PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({ error: 'El recurso ya existe (violación de unicidad).' });
  }
  if (err.code === '23503') {
    return res.status(409).json({ error: 'Operación rechazada por restricción de clave foránea.' });
  }

  // Error HTTP
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Error del servidor
  return res.status(500).json({ error: 'Error interno del servidor.' });
}

module.exports = errorHandler;
