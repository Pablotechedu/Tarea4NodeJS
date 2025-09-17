// Limpieza después de ejecutar todas las pruebas
import { sequelize } from "../models/index.js";

export default async () => {
  try {
    // Cerrar conexión a la base de datos
    await sequelize.close();
    console.log("🔌 Conexión a base de datos cerrada");
  } catch (error) {
    console.error(" Error en teardown:", error);
  }
};
