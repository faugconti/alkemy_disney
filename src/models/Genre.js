const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Genre = sequelize.define(
  "genre",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: false }
);

module.exports = Genre;
