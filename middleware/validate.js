/**
 * @param {import('zod').ZodSchema} schema
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        campo: e.path.join('.') || 'body',
        mensaje: e.message,
      }));

      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        detalles: errors,
      });
    }

    req.validatedData = result.data;
    next();
  };
}

module.exports = validate;
