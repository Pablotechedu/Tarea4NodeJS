// Modelo de Tarea usando Sequelize
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [1, 200],
        notEmpty: true,
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000],
      },
    },

    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
      allowNull: false,
      validate: {
        isIn: [["low", "medium", "high"]],
      },
    },

    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString(), // Debe ser fecha futura
      },
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    // Configuración del modelo
    tableName: "tasks",
    timestamps: true,

    // Índices para mejorar performance
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["completed"],
      },
      {
        fields: ["priority"],
      },
      {
        fields: ["dueDate"],
      },
    ],
  }
);

export default Task;
