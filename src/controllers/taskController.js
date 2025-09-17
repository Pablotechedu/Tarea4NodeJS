// Controlador de tareas - CRUD básico
import { Task, User } from "../models/index.js";
import { createError } from "../middlewares/errorHandler.js";

// GET /tasks - Obtener todas las tareas del usuario autenticado
export const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Tareas obtenidas correctamente",
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

// GET /tasks/:id - Obtener una tarea específica
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
    });

    if (!task) {
      throw createError(404, "Tarea no encontrada");
    }

    res.json({
      success: true,
      message: "Tarea obtenida correctamente",
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// POST /tasks - Crear nueva tarea
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const userId = req.user.id;

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      userId,
      completed: false,
    });

    // Obtener la tarea creada con la información del usuario
    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Tarea creada correctamente",
      data: { task: createdTask },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /tasks/:id - Actualizar tarea completa
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate } = req.body;
    const userId = req.user.id;

    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      throw createError(404, "Tarea no encontrada");
    }

    // Actualizar solo los campos proporcionados
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;

    await task.update(updateData);

    // Obtener la tarea actualizada con información del usuario
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Tarea actualizada correctamente",
      data: { task: updatedTask },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /tasks/:id - Eliminar tarea
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      throw createError(404, "Tarea no encontrada");
    }

    await task.destroy();

    res.json({
      success: true,
      message: "Tarea eliminada correctamente",
      data: { deletedTaskId: id },
    });
  } catch (error) {
    next(error);
  }
};
