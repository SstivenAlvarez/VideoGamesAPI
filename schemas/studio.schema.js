const { z } = require('zod');

const CURRENT_YEAR = new Date().getFullYear();

const createStudioSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del estudio es obligatorio' })
    .min(1,   'El nombre no puede estar vacío')
    .max(255, 'El nombre no puede superar los 255 caracteres'),

  country: z
    .string()
    .max(100, 'El país no puede superar los 100 caracteres')
    .optional(),

  founded_year: z
    .number()
    .int('El año de fundación debe ser un número entero')
    .min(1800, 'El año de fundación no puede ser anterior a 1800')
    .max(CURRENT_YEAR, `El año de fundación no puede ser posterior a ${CURRENT_YEAR}`)
    .optional(),

  website: z
    .string()
    .url('El website debe ser una URL válida (incluyendo http:// o https://)')
    .optional(),
});

const updateStudioSchema = z
  .object({
    name: z
      .string()
      .min(1,   'El nombre no puede estar vacío')
      .max(255, 'El nombre no puede superar los 255 caracteres')
      .optional(),

    country: z
      .string()
      .max(100, 'El país no puede superar los 100 caracteres')
      .optional(),

    founded_year: z
      .number()
      .int('El año de fundación debe ser un número entero')
      .min(1800, 'El año de fundación no puede ser anterior a 1800')
      .max(CURRENT_YEAR, `El año de fundación no puede ser posterior a ${CURRENT_YEAR}`)
      .optional(),

    website: z
      .string()
      .url('El website debe ser una URL válida (incluyendo http:// o https://)')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes proporcionar al menos un campo para actualizar',
  });

module.exports = { createStudioSchema, updateStudioSchema };
