const pool = require('../db/pool');

async function getAll(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT * FROM studios ORDER BY id ASC'
    );
    return res.status(200).json({ studios: result.rows });
  } catch (err) {
    next(err);
  }
}


async function getById(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM studios WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Estudio no encontrado.' });
    }

    return res.status(200).json({ studio: result.rows[0] });
  } catch (err) {
    next(err);
  }
}


async function create(req, res, next) {
  try {
    const { name, country, founded_year, website } = req.validatedData;

    const result = await pool.query(
      `INSERT INTO studios (name, country, founded_year, website)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, country ?? null, founded_year ?? null, website ?? null]
    );

    return res.status(201).json({ studio: result.rows[0] });
  } catch (err) {
    next(err);
  }
}


async function update(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      'SELECT id FROM studios WHERE id = $1',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Estudio no encontrado.' });
    }

    const { name, country, founded_year, website } = req.validatedData;

    const fields = [];
    const values = [];
    let i = 1;

    if (name         !== undefined) { fields.push(`name = $${i++}`);          values.push(name); }
    if (country      !== undefined) { fields.push(`country = $${i++}`);        values.push(country); }
    if (founded_year !== undefined) { fields.push(`founded_year = $${i++}`);   values.push(founded_year); }
    if (website      !== undefined) { fields.push(`website = $${i++}`);        values.push(website); }

    values.push(id);

    const result = await pool.query(
      `UPDATE studios SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    return res.status(200).json({ studio: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      'SELECT id FROM studios WHERE id = $1',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Estudio no encontrado.' });
    }

    const gamesCheck = await pool.query(
      'SELECT id FROM games WHERE studio_id = $1 LIMIT 1',
      [id]
    );
    if (gamesCheck.rows.length > 0) {
      return res.status(409).json({
        error: 'No se puede eliminar el estudio porque tiene videojuegos asociados. Elimina los videojuegos primero.',
      });
    }

    await pool.query('DELETE FROM studios WHERE id = $1', [id]);

    return res.status(200).json({ message: 'Estudio eliminado correctamente.' });
  } catch (err) {
    next(err);
  }
}


async function getStudioGames(req, res, next) {
  try {
    const { id } = req.params;

    const studioResult = await pool.query(
      'SELECT * FROM studios WHERE id = $1',
      [id]
    );
    if (studioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Estudio no encontrado.' });
    }

    const gamesResult = await pool.query(
      'SELECT * FROM games WHERE studio_id = $1 ORDER BY id ASC',
      [id]
    );

    return res.status(200).json({
      studio: studioResult.rows[0],
      games:  gamesResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, getStudioGames };