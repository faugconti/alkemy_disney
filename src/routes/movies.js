const express = require("express");
const moviesController = require("../controllers/movies");
const router = express.Router();
const { check, param, body } = require("express-validator");
const isAuth = require("../middleware/isAuth");

const updateValidator = [
  body("title").isString({ min: "1" }).optional(),
  body("created").isDate().optional(),
  body("rating").isInt({ min: 1, max: 5 }).optional(),
  body("type").optional().isIn(["MOVIE", "SHOW"]),
  body("genreId").optional().isInt({ min: 1 }),
  body("image").isURL().optional(),
];

router.get("", moviesController.getAllMovies);
router.get(
  "/:id",
  [param("id").isInt({ min: 1 }).exists()],
  moviesController.getMovieById
);
router.use(isAuth);

router.post(
  "",
  [
    check("title").exists().isString(),
    check("image").optional().isURL(),
    check("created").exists().isDate(),
    check("genreId").exists().isInt({ min: 1 }),
    check("rating").optional().isInt({ min: 1, max: 5 }),
    check("type").exists().isIn(["MOVIE", "SHOW"]),
  ],
  moviesController.createMovie
);

router.patch(
  "/:id",
  [param("id").isInt({ min: 1 })],
  updateValidator,
  moviesController.updateMovie
);
router.delete(
  "/:id",
  [param("id").isInt({ min: 1 })],
  moviesController.deleteById
);

module.exports = router;
