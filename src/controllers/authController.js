// Controlador de autenticación
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User } from "../models/index.js";
import config from "../config/config.js";
import { createError } from "../middlewares/errorHandler.js";

// Función helper para generar JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Función helper para respuesta de usuario autenticado
const createAuthResponse = (user, token) => ({
  success: true,
  message: "Autenticación exitosa",
  data: {
    user: user.toJSON(), // Esto excluye la contraseña
    token,
    expiresIn: config.jwt.expiresIn,
  },
});

// Registrar nuevo usuario
export const register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw createError(409, "El email o username ya está registrado");
    }

    // Crear nuevo usuario
    const user = await User.create({
      username,
      email,
      password, // Se hashea automáticamente en el hook del modelo
      firstName,
      lastName,
    });

    // Generar token
    const token = generateToken(user.id);

    res.status(201).json(createAuthResponse(user, token));
  } catch (error) {
    next(error);
  }
};

// Iniciar sesión
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw createError(401, "Credenciales inválidas");
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw createError(401, "Cuenta desactivada");
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw createError(401, "Credenciales inválidas");
    }

    // Generar token
    const token = generateToken(user.id);

    res.json(createAuthResponse(user, token));
  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res, next) => {
  try {
    // El usuario ya está disponible en req.user gracias al middleware de auth
    res.json({
      success: true,
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil del usuario autenticado
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, username } = req.body;
    const userId = req.user.id;

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
      message: "Perfil actualizado correctamente",
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cambiar contraseña
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verificar contraseña actual
    const isValidPassword = await req.user.comparePassword(currentPassword);
    if (!isValidPassword) {
      throw createError(400, "Contraseña actual incorrecta");
    }

    // Actualizar contraseña (se hashea automáticamente)
    await req.user.update({ password: newPassword });

    res.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

// Cerrar sesión (invalidar token - en una implementación real usarías una blacklist)
export const logout = async (req, res, next) => {
  try {
    // En una implementación real, aquí agregarías el token a una blacklist
    // Por ahora, solo retornamos un mensaje de éxito
    res.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    next(error);
  }
};
