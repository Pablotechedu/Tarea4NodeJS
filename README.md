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

## Requisitos Previos

Para ejecutar este proyecto necesitas tener instalado:

- Docker (versión 20.10 o superior)
- Docker Compose (versión 1.29 o superior)

Verifica las versiones instaladas con:

```bash
docker --version
docker-compose --version
```

## Instalación y Despliegue con Docker

### Opción 1: Usar Docker Compose (Recomendado)

Esta es la forma más sencilla de ejecutar toda la aplicación junto con su base de datos.

**Paso 1: Clonar el repositorio**

```bash
git clone https://github.com/Pablotechedu/Tarea4NodeJS.git
cd Tarea4NodeJS
```

**Paso 2: Levantar los servicios**

```bash
docker-compose up -d
```

Este comando realiza lo siguiente:

- Construye la imagen de la aplicación si no existe
- Descarga la imagen de PostgreSQL
- Crea y ejecuta ambos contenedores
- Configura la red privada entre servicios

**Paso 3: Verificar que los contenedores estén activos**

```bash
docker-compose ps
```

Deberías ver algo similar a:

```
NAME                 IMAGE              STATUS         PORTS
task-api-app         task-api:latest    Up 30 seconds  0.0.0.0:3000->3000/tcp
task-api-postgres    postgres:15-alpine Up 30 seconds  0.0.0.0:5433->5432/tcp
```

**Paso 4: Verificar los logs**

```bash
docker-compose logs -f app
```

### Opción 2: Construcción Manual de la Imagen

Si prefieres construir la imagen manualmente:

```bash
# Construir la imagen
docker build -t task-api:latest .

# Verificar que se creó correctamente
docker images | grep task-api
```

### Acceso a la Aplicación

Una vez iniciados los contenedores, la API estará disponible en:

```
http://localhost:3000
```

Puertos expuestos:

- **3000**: API de la aplicación
- **5433**: PostgreSQL (mapeado desde el puerto interno 5432)

## Pruebas de Funcionamiento

### Verificar que la API está activa

```bash
curl http://localhost:3000/
```

### Registro de usuario

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"usuario_prueba","email":"prueba@example.com","password":"Password123!","firstName":"Prueba","lastName":"Usuario"}'
```

### Inicio de sesión

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prueba@example.com","password":"Password123!"}'
```

Guarda el token JWT que recibes en la respuesta (dentro de `data.token`) para las siguientes pruebas.

### Crear una tarea

Reemplaza `YOUR_JWT_TOKEN` con el token obtenido en el paso anterior:

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Mi primera tarea","description":"Descripción de la tarea"}'
```

### Listar tareas

```bash
curl -X GET http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Endpoints de la API

### Autenticación

| Método | Endpoint           | Descripción             |
| ------ | ------------------ | ----------------------- |
| POST   | /api/auth/register | Registrar nuevo usuario |
| POST   | /api/auth/login    | Iniciar sesión          |

### Tareas

| Método | Endpoint       | Descripción                          |
| ------ | -------------- | ------------------------------------ |
| GET    | /api/tasks     | Obtener todas las tareas del usuario |
| GET    | /api/tasks/:id | Obtener tarea específica             |
| POST   | /api/tasks     | Crear nueva tarea                    |
| PUT    | /api/tasks/:id | Actualizar tarea                     |
| DELETE | /api/tasks/:id | Eliminar tarea                       |

## Gestión de Contenedores

### Ver logs de la aplicación

```bash
docker-compose logs -f app
```

### Ver logs de la base de datos

```bash
docker-compose logs -f postgres
```

### Detener los contenedores

```bash
docker-compose down
```

### Detener y eliminar volúmenes (datos de la base de datos)

```bash
docker-compose down -v
```

### Reconstruir las imágenes

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Despliegue en Play with Docker

Play with Docker es una plataforma gratuita que permite ejecutar contenedores directamente en el navegador.

**Paso 1:** Accede a https://labs.play-with-docker.com

**Paso 2:** Inicia sesión con tu cuenta de Docker Hub

**Paso 3:** Haz clic en "Start" para crear una nueva sesión

**Paso 4:** Haz clic en "+ ADD NEW INSTANCE"

**Paso 5:** En la terminal, ejecuta:

```bash
git clone https://github.com/Pablotechedu/Tarea4NodeJS.git
cd Tarea4NodeJS
docker-compose up -d
```

**Paso 6:** Play with Docker mostrará automáticamente un enlace clickeable junto al puerto 3000. Haz clic en él para acceder a la aplicación.

## Estructura del Proyecto

```
.
├── Dockerfile              # Definición de la imagen Docker
├── docker-compose.yml      # Orquestación de servicios
├── package.json           # Dependencias del proyecto
├── src/                   # Código fuente
│   ├── server.js         # Punto de entrada
│   ├── app.js            # Configuración de Express
│   ├── controllers/      # Lógica de negocio
│   ├── models/           # Modelos de datos (Sequelize)
│   ├── routes/           # Definición de rutas
│   ├── middlewares/      # Middlewares personalizados
│   └── tests/            # Pruebas unitarias
└── docs/                 # Documentación adicional
```

## Variables de Entorno

El proyecto utiliza las siguientes variables configuradas en docker-compose.yml:

**Aplicación:**

- NODE_ENV: Entorno de ejecución (development/production)

**Base de Datos:**

- POSTGRES_DB: task_api_db
- POSTGRES_USER: postgres
- POSTGRES_PASSWORD: postgres123

## Comandos Docker Útiles

```bash
# Ver todas las imágenes
docker images

# Ver contenedores activos
docker ps

# Ver todos los contenedores (incluyendo detenidos)
docker ps -a

# Acceder al contenedor de la aplicación
docker exec -it task-api-app sh

# Acceder a PostgreSQL
docker exec -it task-api-postgres psql -U postgres -d task_api_db

# Ver uso de recursos
docker stats

# Limpiar recursos no usados
docker system prune -a
```

## Características del Dockerfile

El Dockerfile implementado incluye:

- Imagen base Node.js 18 Alpine (ligera y segura)
- Instalación optimizada de dependencias con npm ci
- Solo dependencias de producción en la imagen final
- Puerto 3000 expuesto para la API
- Configuración apropiada del directorio de trabajo

## Solución de Problemas

### La aplicación no se conecta a la base de datos

Verifica que los contenedores estén en la misma red:

```bash
docker network ls
docker network inspect task-api-network
```

### El contenedor se detiene inmediatamente

Revisa los logs para identificar el error:

```bash
docker-compose logs app
```

### Puerto ya en uso

Si el puerto 3000 está ocupado, puedes cambiarlo en docker-compose.yml:

```yaml
ports:
  - "3001:3000" # Cambiar el puerto del host
```

## Validaciones

La API implementa validaciones para:

- **Usuarios**: email válido, contraseña segura, campos requeridos
- **Tareas**: título requerido, descripción opcional
- **Autenticación**: tokens JWT válidos

## Base de Datos

### Modelos

- **Users**: id, username, email, password, firstName, lastName
- **Tasks**: id, title, description, completed, priority, dueDate, userId

## Pruebas

El proyecto incluye pruebas automatizadas que cubren:

- Autenticación (registro, login)
- Operaciones CRUD de tareas
- Validación de datos
- Manejo de errores

## Licencia

MIT
