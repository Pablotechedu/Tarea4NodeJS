// Utilidad para probar la conexión a la base de datos
import { sequelize } from "../models/index.js";

export const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente.");
    return true;
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
    return false;
  }
};

export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log(
      `✅ Base de datos sincronizada ${force ? "(recreada)" : "(actualizada)"}.`
    );
    return true;
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error.message);
    return false;
  }
};
