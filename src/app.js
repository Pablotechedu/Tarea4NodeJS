// Configuración principal de la aplicación Express
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Importar rutas
import routes from "./routes/index.js";

// Importar middlewares personalizados
import { errorHandler } from "./middlewares/errorHandler.js";

// Importar configuración de base de datos
import { sequelize } from "./models/index.js";

// Cargar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();

// Middlewares de seguridad y utilidad
app.use(helmet()); // Configurar headers de seguridad
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(morgan("combined")); // Logging de requests HTTP

// Middlewares para parsing de datos
app.use(express.json({ limit: "10mb" })); // Parser JSON con límite
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parser URL-encoded

// Middleware para servir archivos estáticos (si es necesario)
app.use(express.static("public"));

// Ruta de salud del servidor
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Task API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Rutas principales de la API
app.use("/api/v1", routes);

// Ruta para manejar endpoints no encontrados
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      health: "GET /health",
      auth: "POST /api/v1/auth/*",
      tasks: "GET|POST|PUT|DELETE /api/v1/tasks/*",
      users: "GET|PUT|DELETE /api/v1/users/*",
    },
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Función para inicializar la aplicación
export const initializeApp = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida");

    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Modelos sincronizados con la base de datos");
    }

    return app;
  } catch (error) {
    console.error("❌ Error al inicializar la aplicación:", error);
    throw error;
  }
};

export default app;
