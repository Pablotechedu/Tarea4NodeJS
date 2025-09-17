// Punto de entrada del servidor
import { initializeApp } from "./app.js";
import config from "./config/config.js";

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Inicializar la aplicación
    const app = await initializeApp();

    // Obtener puerto de la configuración
    const PORT = config.server.port;

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Servidor iniciado exitosamente
📍 Puerto: ${PORT}
🌍 Entorno: ${config.server.env}
📊 API Version: ${config.server.apiVersion}
🔗 Health Check: http://localhost:${PORT}/health
📚 API Base URL: http://localhost:${PORT}/api/v1
      `);
    });

    // Manejo de cierre graceful del servidor
    const gracefulShutdown = () => {
      console.log("\n🔄 Cerrando servidor...");
      server.close(() => {
        console.log("✅ Servidor cerrado correctamente");
        process.exit(0);
      });
    };

    // Escuchar señales de terminación
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
