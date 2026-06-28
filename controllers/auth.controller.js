const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const pool     = require('../db/pool');

const SALT_ROUNDS = 12;

async function register(req, res, next) {
  try {
    const { username, email, password } = req.validatedData;

    // Verificar unicidad de email y username en una sola consulta parametrizada
    const duplicate = await pool.query(
      'SELECT username, email FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (duplicate.rows.length > 0) {
      const taken = duplicate.rows[0];
      if (taken.email === email) {
        return res.status(409).json({ error: 'El email ya está registrado.' });
      }
      return res.status(409).json({ error: 'El username ya está en uso.' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, password_hash]
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}


async function login(req, res, next) {
  try {
    const { email, password } = req.validatedData;

    const result = await pool.query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
