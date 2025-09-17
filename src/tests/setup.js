// Configuración inicial para las pruebas
import { sequelize } from "../models/index.js";

// Configurar base de datos de pruebas antes de ejecutar tests
beforeAll(async () => {
  try {
    // Establecer entorno de pruebas
    process.env.NODE_ENV = "test";

    // Conectar a la base de datos de pruebas
    await sequelize.authenticate();
    console.log(" Conectado a la base de datos de pruebas");

    // Sincronizar modelos (recrear tablas)
    await sequelize.sync({ force: true });
    console.log(" Base de datos de pruebas sincronizada");
  } catch (error) {
    console.error(" Error en setup de pruebas:", error);
    throw error;
  }
});

// Limpiar base de datos después de cada test
afterEach(async () => {
  try {
    // Limpiar todas las tablas pero mantener estructura
    await sequelize.truncate({ cascade: true, restartIdentity: true });
  } catch (error) {
    console.error(" Error limpiando base de datos:", error);
  }
});
