const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const genreController = require("../controllers/genre");
const isAuth = require("../middleware/isAuth");

router.get("", genreController.getGenres);
router.use(isAuth);
router.post(
  "",
  [body("name").isString().exists().notEmpty()],
  genreController.createGenre
);
router.delete(
  "/:id",
  [param("id").isInt({ min: 1 }).exists()],
  genreController.deleteGenre
);

module.exports = router;
