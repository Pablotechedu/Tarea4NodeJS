// Rutas de autenticación
import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../middlewares/validation.js";
import { authenticateToken } from "../middlewares/auth.js";
import { body } from "express-validator";

const router = express.Router();

// Rutas públicas (no requieren autenticación)

// POST /auth/register - Registrar nuevo usuario
router.post("/register", validateRegister, register);

// POST /auth/login - Iniciar sesión
router.post("/login", validateLogin, login);

// Rutas protegidas (requieren autenticación)

// GET /auth/profile - Obtener perfil del usuario autenticado
router.get("/profile", authenticateToken, getProfile);

// PUT /auth/profile - Actualizar perfil del usuario
router.put(
  "/profile",
  authenticateToken,
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
  updateProfile
);

// PUT /auth/change-password - Cambiar contraseña
router.put(
  "/change-password",
  authenticateToken,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("La contraseña actual es requerida"),

    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("La nueva contraseña debe tener al menos 8 caracteres")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "La nueva contraseña debe contener al menos una minúscula, una mayúscula y un número"
      ),

    handleValidationErrors,
  ],
  changePassword
);

// POST /auth/logout - Cerrar sesión
router.post("/logout", authenticateToken, logout);

// Ruta de información sobre endpoints disponibles
router.get("/", (req, res) => {
  res.json({
    message: "Auth API Endpoints",
    endpoints: {
      register: "POST /auth/register",
      login: "POST /auth/login",
      profile: "GET /auth/profile (protected)",
      updateProfile: "PUT /auth/profile (protected)",
      changePassword: "PUT /auth/change-password (protected)",
      logout: "POST /auth/logout (protected)",
    },
    note: "Protected endpoints require Authorization header with Bearer token",
  });
});

export default router;
