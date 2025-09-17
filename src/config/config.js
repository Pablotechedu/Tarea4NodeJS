// Configuración general de la aplicación
import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
    apiVersion: process.env.API_VERSION || "v1",
  },

  // Configuración JWT
  jwt: {
    secret: process.env.JWT_SECRET || "fallback_secret_change_in_production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  // Configuración de bcrypt
  bcrypt: {
    saltRounds: 12,
  },

  // Configuración de validación
  validation: {
    passwordMinLength: 8,
    usernameMinLength: 3,
    taskTitleMaxLength: 200,
    taskDescriptionMaxLength: 1000,
  },
};

export default config;
