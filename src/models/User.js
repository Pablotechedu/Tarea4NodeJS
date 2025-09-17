// Modelo de Usuario usando Sequelize
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";
import config from "../config/config.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        notEmpty: true,
        isAlphanumeric: true,
      },
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255],
        notEmpty: true,
      },
    },

    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true,
      },
    },

    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true,
      },
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // Configuración del modelo
    tableName: "users",
    timestamps: true, // Agrega createdAt y updatedAt automáticamente

    // Hooks para hashear password antes de guardar
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(
            user.password,
            config.bcrypt.saltRounds
          );
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(
            user.password,
            config.bcrypt.saltRounds
          );
        }
      },
    },

    // Métodos de instancia
    instanceMethods: {
      // Método para comparar passwords
      async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
      },
    },
  }
);

// Método de instancia para comparar passwords
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener datos públicos del usuario (sin password)
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default User;
