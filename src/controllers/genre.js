const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Genre = require("../models/Genre");

exports.getGenres = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }
  let genres;
  try {
    genres = await Genre.findAll();
    if (!genres || genres.length === 0) {
      return next(new HttpError("(404) Resources not found.", 404));
    }
  } catch {
    return next(new HttpError("(500) Could not fetch resources.", 500));
  }
  res.json([...genres]);
};

exports.createGenre = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }
  try {
    await Genre.create(req.body);
  } catch (err) {
    return next(new HttpError("(500) Could not create new resource", 500));
  }

  res.json({ message: "(OK) Resource created." });
};

exports.deleteGenre = async (req, res, next) => {
  console.log(req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("(422) Invalid inputs, please check your data", 422)
    );
  }
  const id = req.params.id;
  let genre;

  try {
    genre = await Genre.findByPk(id);
    if (!genre) {
      return next(new HttpError("(404) Resource not found", 404));
    }
    await genre.destroy();
  } catch (err) {
    return next(new HttpError("(500) Could not delete resource", 500));
  }
  res.json({ message: "(OK) Resource deleted" });
};
