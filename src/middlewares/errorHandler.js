// Middleware centralizado para manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error("Error capturado:", err);

  // Error de validación de Sequelize
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors,
    });
  }

  // Error de restricción única de Sequelize
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0].path;
    return res.status(409).json({
      success: false,
      message: `El ${field} ya está en uso`,
      field,
    });
  }

  // Error de clave foránea de Sequelize
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Referencia inválida a recurso relacionado",
    });
  }

  // Error de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expirado",
    });
  }

  // Error personalizado con status
  if (err.status || err.statusCode) {
    return res.status(err.status || err.statusCode).json({
      success: false,
      message: err.message || "Error del servidor",
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err.message,
    }),
  });
};

// Función helper para crear errores personalizados
export const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
