const { z } = require('zod');

const CURRENT_YEAR = new Date().getFullYear();

const createGameSchema = z.object({
  title: z
    .string({ required_error: 'El título del videojuego es obligatorio' })
    .min(1,   'El título no puede estar vacío')
    .max(255, 'El título no puede superar los 255 caracteres'),

  genre: z
    .string()
    .max(100, 'El género no puede superar los 100 caracteres')
    .optional(),

  release_year: z
    .number()
    .int('El año de lanzamiento debe ser un número entero')
    .min(1950, 'El año de lanzamiento no puede ser anterior a 1950')
    .max(CURRENT_YEAR + 5, `El año de lanzamiento no puede ser superior a ${CURRENT_YEAR + 5}`)
    .optional(),

  platform: z
    .string()
    .max(100, 'La plataforma no puede superar los 100 caracteres')
    .optional(),

  description: z
    .string()
    .optional(),

  studio_id: z
    .number({ required_error: 'El studio_id es obligatorio' })
    .int('El studio_id debe ser un número entero')
    .positive('El studio_id debe ser un número positivo'),
});

const updateGameSchema = z
  .object({
    title: z
      .string()
      .min(1,   'El título no puede estar vacío')
      .max(255, 'El título no puede superar los 255 caracteres')
      .optional(),

    genre: z
      .string()
      .max(100, 'El género no puede superar los 100 caracteres')
      .optional(),

    release_year: z
      .number()
      .int('El año de lanzamiento debe ser un número entero')
      .min(1950, 'El año de lanzamiento no puede ser anterior a 1950')
      .max(CURRENT_YEAR + 5, `El año de lanzamiento no puede ser superior a ${CURRENT_YEAR + 5}`)
      .optional(),

    platform: z
      .string()
      .max(100, 'La plataforma no puede superar los 100 caracteres')
      .optional(),

    description: z
      .string()
      .optional(),

    studio_id: z
      .number()
      .int('El studio_id debe ser un número entero')
      .positive('El studio_id debe ser un número positivo')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes proporcionar al menos un campo para actualizar',
  });

module.exports = { createGameSchema, updateGameSchema };
