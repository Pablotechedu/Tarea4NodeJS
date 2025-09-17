// Middlewares de validación usando express-validator
import { body, param, validationResult } from "express-validator";
import { createError } from "./errorHandler.js";

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: formattedErrors,
    });
  }
  next();
};

// Validaciones para autenticación
export const validateRegister = [
  body("username")
    .isLength({ min: 3, max: 50 })
    .withMessage("El username debe tener entre 3 y 50 caracteres")
    .isAlphanumeric()
    .withMessage("El username solo puede contener letras y números"),

  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
    ),

  body("firstName")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres")
    .trim(),

  body("lastName")
    .isLength({ min: 1, max: 50 })
    .withMessage("El apellido debe tener entre 1 y 50 caracteres")
    .trim(),

  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es requerida"),

  handleValidationErrors,
];

// Validaciones para tareas
export const validateCreateTask = [
  body("title")
    .isLength({ min: 1, max: 200 })
    .withMessage("El título debe tener entre 1 y 200 caracteres")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede exceder 1000 caracteres")
    .trim(),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("La prioridad debe ser: low, medium o high"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe estar en formato ISO 8601")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("La fecha de vencimiento debe ser futura");
      }
      return true;
    }),

  handleValidationErrors,
];

export const validateUpdateTask = [
  body("title")
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage("El título debe tener entre 1 y 200 caracteres")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede exceder 1000 caracteres")
    .trim(),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed debe ser true o false"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("La prioridad debe ser: low, medium o high"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe estar en formato"),

  handleValidationErrors,
];

// Validaciones para parámetros
export const validateUUID = (paramName = "id") => [
  param(paramName).isUUID().withMessage(`${paramName} debe ser un UUID válido`),

  handleValidationErrors,
];
