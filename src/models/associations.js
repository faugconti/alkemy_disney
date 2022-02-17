const { Media, Character, User, Genre } = require("./index");
// const sequelize = require("../database");
// const { DataTypes } = require("sequelize");

// const Appearances = sequelize.define(
//   "appearances",
//   {
//     idMedia: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: Media,
//         key: "id",
//       },
//     },
//     idCharacter: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: Character,
//         key: "id",
//       },
//     },
//   },
//   { timestamps: false }
// );

Media.belongsToMany(Character, { through: "appearances", timestamps: false });
Character.belongsToMany(Media, { through: "appearances", timestamps: false });

Media.belongsTo(Genre);
