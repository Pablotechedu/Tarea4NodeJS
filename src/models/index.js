// Archivo principal de modelos que define las asociaciones
import sequelize from "../config/database.js";
import User from "./User.js";
import Task from "./Task.js";

// Definir asociaciones entre modelos
// Un usuario puede tener muchas tareas
User.hasMany(Task, {
  foreignKey: "userId",
  as: "tasks",
  onDelete: "CASCADE", // Si se elimina un usuario, se eliminan sus tareas
});

// Una tarea pertenece a un usuario
Task.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Exportar modelos y sequelize
export { sequelize, User, Task };

export default {
  sequelize,
  User,
  Task,
};
