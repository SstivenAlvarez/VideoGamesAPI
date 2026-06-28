const pool = require('../db/pool');


async function getAll(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT g.*, s.name AS studio_name
       FROM   games g
       JOIN   studios s ON g.studio_id = s.id
       ORDER BY g.id ASC`
    );
    return res.status(200).json({ games: result.rows });
  } catch (err) {
    next(err);
  }
}


async function getById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT g.*, s.name AS studio_name
       FROM   games g
       JOIN   studios s ON g.studio_id = s.id
       WHERE  g.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado.' });
    }

    return res.status(200).json({ game: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, genre, release_year, platform, description, studio_id } = req.validatedData;

    const studioCheck = await pool.query(
      'SELECT id FROM studios WHERE id = $1',
      [studio_id]
    );
    if (studioCheck.rows.length === 0) {
      return res.status(404).json({ error: 'El estudio especificado (studio_id) no existe.' });
    }

    const result = await pool.query(
      `INSERT INTO games (title, genre, release_year, platform, description, studio_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, genre ?? null, release_year ?? null, platform ?? null, description ?? null, studio_id]
    );

    return res.status(201).json({ game: result.rows[0] });
  } catch (err) {
    next(err);
  }
}


async function update(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      'SELECT id FROM games WHERE id = $1',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado.' });
    }

    const { title, genre, release_year, platform, description, studio_id } = req.validatedData;

    // Si se cambia el studio_id, verificar que el nuevo estudio existe
    if (studio_id !== undefined) {
      const studioCheck = await pool.query(
        'SELECT id FROM studios WHERE id = $1',
        [studio_id]
      );
      if (studioCheck.rows.length === 0) {
        return res.status(404).json({ error: 'El estudio especificado (studio_id) no existe.' });
      }
    }

    const fields = [];
    const values = [];
    let i = 1;

    if (title        !== undefined) { fields.push(`title = $${i++}`);         values.push(title); }
    if (genre        !== undefined) { fields.push(`genre = $${i++}`);         values.push(genre); }
    if (release_year !== undefined) { fields.push(`release_year = $${i++}`);  values.push(release_year); }
    if (platform     !== undefined) { fields.push(`platform = $${i++}`);      values.push(platform); }
    if (description  !== undefined) { fields.push(`description = $${i++}`);   values.push(description); }
    if (studio_id    !== undefined) { fields.push(`studio_id = $${i++}`);     values.push(studio_id); }

    values.push(id);

    const result = await pool.query(
      `UPDATE games SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    return res.status(200).json({ game: result.rows[0] });
  } catch (err) {
    next(err);
  }
}


async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      'SELECT id FROM games WHERE id = $1',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado.' });
    }

    await pool.query('DELETE FROM games WHERE id = $1', [id]);

    return res.status(200).json({ message: 'Videojuego eliminado correctamente.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
