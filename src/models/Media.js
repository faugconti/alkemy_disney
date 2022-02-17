const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Media = sequelize.define(
  "media",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
    },
    created: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      validate: {
        max: 5,
        min: 1,
      },
    },
    type: {
      type: DataTypes.ENUM("MOVIE", "SHOW"),
      defaultValue: "MOVIE",
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Media;
