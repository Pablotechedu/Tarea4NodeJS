// Configuración de la base de datos usando Sequelize
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Configuración para diferentes entornos
const config = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres123",
    database: process.env.DB_NAME || "task_api_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5433,
    dialect: "postgres",
    logging: console.log, // Mostrar queries SQL en desarrollo
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres123",
    database: `${process.env.DB_NAME}_test` || "task_api_db_test",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5433,
    dialect: "postgres",
    logging: false, // No mostrar queries en tests
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    // Configuraciones adicionales para producción
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Crear instancia de Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool || {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export { sequelize, config };
export default sequelize;
