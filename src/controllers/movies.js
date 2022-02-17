const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Media = require("../models/Media");
const Character = require("../models/Character");
const { Op } = require("sequelize");

exports.getAllMovies = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }

  let movies;
  const whereFilters = {};

  const { title, order, genre } = req.query;
  console.log(req.query);

  try {
    if (title || order || genre) {
      whereFilters[Op.and] = [];

      if (title) {
        whereFilters[Op.and].push({
          title: {
            [Op.like]: `%${title}%`,
          },
        });
      }
      if (genre) {
        whereFilters[Op.and].push({
          genreId: {
            [Op.eq]: +genre,
          },
        });
      }
      movies = await Media.findAll({
        where: whereFilters,
        order: order ? [["created", order]] : undefined,
        attributes: ["id", "title", "image"],
      });
    } else {
      movies = await Media.findAll({
        attributes: ["id", "title", "image"],
      });
    }

    if (!movies || movies.length === 0) {
      return next(new HttpError("(404) Resource not found", 404));
    }
  } catch (err) {
    return next(new HttpError("(500) Could not fetch resources.", 500));
  }

  res.json([...movies]);
};

exports.createMovie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }
  console.log(req.body);
  try {
    const movie = await Media.create(req.body);
  } catch (err) {
    return next(new HttpError("could not create new movie", 500));
  }

  res.json({ message: "(OK) Resource created." });
};

exports.updateMovie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }

  const id = req.params.id;
  let movie;

  try {
    movie = await Media.findByPk(id);
    if (!movie) {
      return next(new HttpError("(404) Resource not found.", 404));
    }
    await movie.update(req.body);
  } catch (err) {
    return next(new HttpError("(500) Could not fetch Resource", 500));
  }

  res.json({ message: "(OK) Resource updated." });
};

exports.getMovieById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }

  const id = req.params.id;
  let movie;

  try {
    movie = await Media.findOne({
      where: { id },
      include: [
        {
          model: Character,
          through: { attributes: [] },
          attributes: ["id", "name", "image"],
        },
      ],
    });
    if (!movie) {
      return next(new HttpError("(404) Resource not found.", 404));
    }
  } catch (err) {
    console.log(err);
    return next(new HttpError("(500) Error fetching resource"), 500);
  }
  res.json({ ...movie.get({ plain: true }) });
};

exports.deleteById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }
  const id = req.params.id;
  let movie;

  try {
    movie = await Media.findByPk(id);
    if (!movie) {
      return next(new HttpError("(404) Resource not found", 404));
    }
    await movie.destroy();
  } catch (err) {
    return next(new HttpError("(500) Coudl not delete resource", 500));
  }
  res.json({ message: "(OK) Resource deleted" });
};
