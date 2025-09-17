// Controlador de usuarios - operaciones administrativas
import { User, Task } from "../models/index.js";
import { createError } from "../middlewares/errorHandler.js";
import { Op } from "sequelize";

// GET /users/:id - Obtener información pública de un usuario
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "username", "firstName", "lastName", "createdAt"],
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: ["id", "title", "completed", "priority", "createdAt"],
          limit: 5,
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!user) {
      throw createError(404, "Usuario no encontrado");
    }

    res.json({
      success: true,
      message: "Usuario obtenido correctamente",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /users/:id - Actualizar usuario (solo el propio usuario)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username } = req.body;

    // Verificar que el usuario solo pueda actualizar su propio perfil
    if (id !== req.user.id) {
      throw createError(403, "Solo puedes actualizar tu propio perfil");
    }

    // Verificar si el username ya existe (si se está cambiando)
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw createError(409, "El username ya está en uso");
      }
    }

    // Actualizar usuario
    await req.user.update({
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(username && { username }),
    });

    res.json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: { user: req.user.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /users/:id - Desactivar cuenta (solo el propio usuario)
export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario solo pueda desactivar su propia cuenta
    if (id !== req.user.id) {
      throw createError(403, "Solo puedes desactivar tu propia cuenta");
    }

    // Desactivar usuario en lugar de eliminarlo
    await req.user.update({ isActive: false });

    res.json({
      success: true,
      message: "Cuenta desactivada correctamente",
      data: { userId: id },
    });
  } catch (error) {
    next(error);
  }
};

// GET /users/:id/stats - Obtener estadísticas públicas del usuario
export const getUserStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      throw createError(404, "Usuario no encontrado");
    }

    // Estadísticas básicas públicas
    const totalTasks = await Task.count({ where: { userId: id } });
    const completedTasks = await Task.count({
      where: { userId: id, completed: true },
    });

    res.json({
      success: true,
      message: "Estadísticas del usuario obtenidas correctamente",
      data: {
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        stats: {
          totalTasks,
          completedTasks,
          completionRate:
            totalTasks > 0
              ? ((completedTasks / totalTasks) * 100).toFixed(2)
              : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
