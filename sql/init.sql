-- =============================================================
-- Videogames API — Script de inicialización de base de datos
-- Ejecutar: psql -U <usuario> -d <base_de_datos> -f sql/init.sql
-- =============================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT NOW()
);

-- Tabla de estudios de desarrollo
CREATE TABLE IF NOT EXISTS studios (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  country       VARCHAR(100),
  founded_year  INTEGER,
  website       VARCHAR(255),
  created_at    TIMESTAMP    DEFAULT NOW()
);

-- Tabla de videojuegos (FK a studios)
CREATE TABLE IF NOT EXISTS games (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  genre         VARCHAR(100),
  release_year  INTEGER,
  platform      VARCHAR(100),
  description   TEXT,
  studio_id     INTEGER      NOT NULL REFERENCES studios(id),
  created_at    TIMESTAMP    DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de las queries más frecuentes
CREATE INDEX IF NOT EXISTS idx_games_studio_id ON games(studio_id);
CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);
