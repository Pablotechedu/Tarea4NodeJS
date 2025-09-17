// Router principal que agrupa todas las rutas de la API
import express from "express";
import authRoutes from "./auth.js";
import taskRoutes from "./tasks.js";
import userRoutes from "./users.js";

const router = express.Router();

// Ruta de información de la API
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task API v1.0",
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      tasks: "/tasks",
      users: "/users",
    },
    documentation: "https://github.com/tu-usuario/task-api",
  });
});

// Agrupar rutas por funcionalidad
router.use("/auth", authRoutes); // Rutas de autenticación
router.use("/tasks", taskRoutes); // Rutas de tareas
router.use("/users", userRoutes); // Rutas de usuarios

export default router;
