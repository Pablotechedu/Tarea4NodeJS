// Rutas de tareas - CRUD básico
import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import {
  validateCreateTask,
  validateUpdateTask,
  validateUUID,
} from "../middlewares/validation.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Todas las rutas de tareas requieren autenticación
router.use(authenticateToken);

// GET /tasks - Obtener todas las tareas del usuario
router.get("/", getAllTasks);

// GET /tasks/:id - Obtener tarea específica por ID
router.get("/:id", validateUUID("id"), getTaskById);

// POST /tasks - Crear nueva tarea
router.post("/", validateCreateTask, createTask);

// PUT /tasks/:id - Actualizar tarea completa
router.put("/:id", validateUUID("id"), validateUpdateTask, updateTask);

// DELETE /tasks/:id - Eliminar tarea específica
router.delete("/:id", validateUUID("id"), deleteTask);

export default router;
