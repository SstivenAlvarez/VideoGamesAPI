__Universidad Europea de Madrid__

Desarrollo Avanzado de Backends y APIs en Node.js

Autor
Meyerson Stiven Alvarez

Descripción
Este proyecto consiste en una API REST para gestionar un catálogo de videojuegos.
La aplicación permite registrar usuarios, iniciar sesión mediante JWT y gestionar estudios y videojuegos. Los endpoints GET son públicos y los endpoints POST, PUT y DELETE requieren autenticación.

Tecnologías
1. Node.js
2. Express
3. PostgreSQL
4. JWT (jsonwebtoken)
5. Zod
6. bcryptjs
7. dotenv
8. pg

Instalación
1. Clonar o descargar el proyecto desde GitHub.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar todas las dependencias del proyecto ejecutando el siguiente comando en la terminal:
npm install

4. Tener PostgreSQL instalado y crear una base de datos para el proyecto.
5. Ejecutar el archivo `sql/init.sql` para crear las tablas `users`, `studios` y `games`.
6. Crear un archivo `.env` en la raíz del proyecto utilizando como referencia el archivo `.env.example`.
7. Configurar las variables de entorno con los datos de conexión de PostgreSQL y la clave secreta para JWT.
Ejemplo:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=videogames_db
JWT_SECRET=mi_clave_secreta
PORT=3000

8. Una vez configurado todo, iniciar el servidor con el siguiente comando:
npm run dev

Si la configuración es correcta, el servidor iniciará en
http://localhost:3000

A partir de ese momento la API estará lista para realizar las pruebas.


Endpoints
Autenticación

POST /api/auth/register
Permite registrar un nuevo usuario en la aplicación.

POST /api/auth/login
Permite iniciar sesión y obtener un token JWT para acceder a los endpoints protegidos.
Estudios

GET /api/studios
Obtiene la lista de todos los estudios registrados.

GET /api/studios/:id
Obtiene la información de un estudio a partir de su identificador.

POST /api/studios
Crea un nuevo estudio. Requiere autenticación mediante JWT.

PUT /api/studios/:id
Actualiza la información de un estudio existente. Requiere autenticación.

DELETE /api/studios/:id
Elimina un estudio. Si tiene videojuegos asociados, la operación será rechazada.

GET /api/studios/:id/games
Obtiene todos los videojuegos pertenecientes a un estudio.
Videojuegos

GET /api/games
Obtiene el listado de todos los videojuegos junto con el nombre del estudio.

GET /api/games/:id
Obtiene la información de un videojuego por su identificador.

POST /api/games
Crea un nuevo videojuego. Requiere autenticación.

PUT /api/games/:id
Actualiza la información de un videojuego existente. Requiere autenticación.

DELETE /api/games/:id
Elimina un videojuego de la base de datos.

