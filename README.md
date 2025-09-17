# Task Management API

API RESTful desarrollada con Express.js para la gestión de tareas, implementando operaciones CRUD completas con autenticación de usuarios y validación de datos.

## Características

- API RESTful con Express.js
- Autenticación JWT
- Operaciones CRUD completas para tareas
- Validación de datos con express-validator
- Base de datos PostgreSQL con Sequelize ORM
- Pruebas automatizadas con Jest
- Containerización con Docker

## Tecnologías

- **Backend**: Node.js, Express.js
- **Base de datos**: PostgreSQL
- **ORM**: Sequelize
- **Autenticación**: JWT, bcrypt
- **Validación**: express-validator
- **Testing**: Jest, Supertest
- **Containerización**: Docker

## Instalación

### Requisitos previos

- Node.js (v18 o superior)
- Docker y Docker Compose
- Git

### Configuración

1. Clonar el repositorio:

git clone git@github.com:Pablotechedu/Tarea2NodeJS.git
cd Tarea2NodeJS

Descargar el archivo .env desde Google Drive https://drive.google.com/file/d/1BewXbhimmwONt6aHvvEphOlKmdpRleUw/view?usp=drive_link
Colocar el archivo en la raíz del proyecto

Levantar la base de datos:
docker-compose up postgres -d

Crear base de datos de pruebas:
docker exec -it task-api-postgres psql -U postgres -c "CREATE DATABASE task_api_db_test;"

Uso
# Iniciar servidor en modo desarrollo
npm run dev

# Ejecutar pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

##API Endpoints
Autenticación
Método	Endpoint	Descripción
POST	/api/v1/auth/register	Registrar nuevo usuario
POST	/api/v1/auth/login	Iniciar sesión
GET	/api/v1/auth/profile	Obtener perfil del usuario
Tareas
Método	Endpoint	Descripción
GET	/api/v1/tasks	Obtener todas las tareas del usuario
GET	/api/v1/tasks/:id	Obtener tarea específica
POST	/api/v1/tasks	Crear nueva tarea
PUT	/api/v1/tasks/:id	Actualizar tarea
DELETE	/api/v1/tasks/:id	Eliminar tarea


Ejemplos de uso
Registrar usuario

curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario",
    "email": "usuario@example.com",
    "password": "Password123",
    "firstName": "Nombre",
    "lastName": "Apellido"
  }'

  Crear tarea
  curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "priority": "high"
  }'


Estructura del proyecto
  src/
├── controllers/     # Lógica de negocio
├── models/         # Modelos de base de datos
├── routes/         # Definición de rutas
├── middlewares/    # Middlewares personalizados
├── config/         # Configuraciones
├── tests/          # Pruebas automatizadas
└── utils/          # Utilidades



##Pruebas
El proyecto incluye pruebas automatizadas que cubren:

Autenticación (registro, login)
Operaciones CRUD de tareas
Validación de datos
Manejo de errores
Ejecutar pruebas:

npm test

##Validaciones
La API implementa validaciones para:

Usuarios: email válido, contraseña segura, campos requeridos
Tareas: título requerido, prioridad válida, fechas futuras
Autenticación: tokens JWT válidos
Base de datos
Modelo de datos
Users: id, username, email, password, firstName, lastName
Tasks: id, title, description, completed, priority, dueDate, userId




