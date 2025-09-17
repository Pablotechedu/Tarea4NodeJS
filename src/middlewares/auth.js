// Middleware de autenticación JWT
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import config from "../config/config.js";
import { createError } from "./errorHandler.js";

// Middleware para verificar token JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw createError(401, "Token de acceso requerido");
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Buscar el usuario en la base de datos
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      throw createError(401, "Usuario no válido o inactivo");
    }

    // Agregar usuario al objeto request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware opcional de autenticación (no falla si no hay token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findByPk(decoded.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // En auth opcional, continuamos sin usuario si hay error
    next();
  }
};

// Middleware para verificar que el usuario es propietario del recurso
export const checkResourceOwnership = (
  resourceModel,
  resourceIdParam = "id"
) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findByPk(resourceId);

      if (!resource) {
        throw createError(404, "Recurso no encontrado");
      }

      if (resource.userId !== req.user.id) {
        throw createError(
          403,
          "No tienes permisos para acceder a este recurso"
        );
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};
