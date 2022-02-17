const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Character = require("../models/Character");
const Media = require("../models/Media");
const { Op } = require("sequelize");
const sequelize = require("../database/database");

exports.getCharacters = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }
  const { age, weight, name, movies } = req.query;
  const whereFilters = {};
  let characters;
  console.log(req.query);
  try {
    if (age || weight || name || movies) {
      whereFilters[Op.and] = [];
      if (name) {
        whereFilters[Op.and].push({
          name: {
            [Op.like]: `%${name}%`,
          },
        });
      }
      if (weight) {
        whereFilters[Op.and].push({
          weight: {
            [Op.between]: [+weight - 5, +weight + 5],
          },
        });
      }
      if (age) {
        whereFilters[Op.and].push({
          age: {
            [Op.eq]: age,
          },
        });
      }

      //LEFT JOIN on char
      characters = await Character.findAll({
        where: whereFilters,
        attributes: ["id", "name", "image"],
        include: movies
          ? {
              model: Media,
              through: { attributes: [] },
              attributes: [],
              where: {
                id: movies,
              },
            }
          : undefined,
      });
    } else {
      characters = await Character.findAll({
        attributes: ["id", "name", "image"],
      });
    }
  } catch (err) {
    return next(new HttpError("(500) Could not fetch resource.", 500));
  }

  if (!characters || characters.length === 0) {
    return next(new HttpError("(404) Resource not found.", 404));
  }
  console.log(whereFilters);
  res.json([...characters]);
};

exports.getCharacterById = async (req, res, next) => {
  console.log("[CHARACTER] GET CHARACTER BY ID");
  const id = req.params.id;
  let character;
  try {
    character = await Character.findOne({
      where: { id },
      include: [
        {
          model: Media,
          through: { attributes: [] },
          attributes: ["id", "title", "image", "type"],
        },
      ],
    });
    if (!character) {
      return next(new HttpError("(404) Resource not found.", 404));
    }
  } catch (err) {
    console.log(err);
    return next(new HttpError("(500) Error fetching resource"), 500);
  }
  res.json({ ...character.get({ plain: true }) });
};

exports.createCharacter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, please check your data"), 422);
  }

  const { name, age, weight, history, image, media } = req.body;
  const tx = await sequelize.transaction();
  let character;

  try {
    character = await Character.create(
      {
        name,
        age,
        weight,
        history,
        image,
      },
      { transaction: tx }
    );
    if (media) {
      await character.addMedia(media, { transaction: tx });
    }
    await tx.commit();
  } catch (err) {
    console.log(err);
    await tx.rollback();
    return next(new HttpError("(500) Could not create resource.", 500));
  }
  return res.json({ message: "(OK) Resource created." });
};

exports.deleteCharacter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }

  const id = req.params.id;
  console.log("DELETE CHARACTER");

  try {
    const character = await Character.findByPk(id);
    if (!character) {
      return next(new HttpError("(404) Resource not found.", 404));
    }
    await character.destroy();
  } catch (err) {
    console.log(err);
    return next(new HttpError("(500) Error deleting resource.", 500));
  }
  res.json({
    message: "(OK) Resource Deleted.",
  });
};

exports.updateCharacter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }
  let character;
  const id = req.params.id;

  try {
    character = await Character.findByPk(id);
    if (!character) {
      return next(new HttpError("(404) Resource not found", 404));
    }
    await character.update(req.body);
  } catch (err) {
    return next(new HttpError("(500) Could not update resource", 500));
  }
  res.json({ message: "(OK) Resource updated" });
};
