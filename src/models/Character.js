const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Character = sequelize.define(
  "character",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    history: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

module.exports = Character;
