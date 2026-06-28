const { z } = require('zod');

const registerSchema = z.object({
  username: z
    .string({ required_error: 'El username es obligatorio' })
    .min(3,  'El username debe tener al menos 3 caracteres')
    .max(50, 'El username no puede superar los 50 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'El username solo puede contener letras y números (sin espacios ni símbolos)'),

  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('El email no tiene un formato válido'),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('El email no tiene un formato válido'),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña no puede estar vacía'),
});

module.exports = { registerSchema, loginSchema };
