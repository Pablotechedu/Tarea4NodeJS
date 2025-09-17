// Rutas de usuarios
import express from "express";
import {
  getUserById,
  updateUser,
  deactivateUser,
  getUserStats,
} from "../controllers/userController.js";
import {
  validateUUID,
  handleValidationErrors,
} from "../middlewares/validation.js";
import { authenticateToken, optionalAuth } from "../middlewares/auth.js";
import { body } from "express-validator";

const router = express.Router();

// GET /users/:id - Obtener información pública de usuario (no requiere auth)
router.get("/:id", optionalAuth, validateUUID("id"), getUserById);

// GET /users/:id/stats - Obtener estadísticas públicas del usuario
router.get("/:id/stats", validateUUID("id"), getUserStats);

// PUT /users/:id - Actualizar usuario (requiere autenticación)
router.put(
  "/:id",
  authenticateToken,
  validateUUID("id"),
  [
    body("firstName")
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage("El nombre debe tener entre 1 y 50 caracteres")
      .trim(),

    body("lastName")
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage("El apellido debe tener entre 1 y 50 caracteres")
      .trim(),

    body("username")
      .optional()
      .isLength({ min: 3, max: 50 })
      .withMessage("El username debe tener entre 3 y 50 caracteres")
      .isAlphanumeric()
      .withMessage("El username solo puede contener letras y números"),

    handleValidationErrors,
  ],
  updateUser
);

// DELETE /users/:id - Desactivar cuenta
router.delete("/:id", authenticateToken, validateUUID("id"), deactivateUser);

// Ruta de información sobre endpoints disponibles
router.get("/", (req, res) => {
  res.json({
    message: "Users API Endpoints",
    endpoints: {
      getById: "GET /users/:id (public)",
      getStats: "GET /users/:id/stats (public)",
      update: "PUT /users/:id (protected - own profile only)",
      deactivate: "DELETE /users/:id (protected - own account only)",
    },
    note: "Protected endpoints require Authorization header with Bearer token",
  });
});

export default router;
