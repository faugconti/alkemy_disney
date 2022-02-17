const express = require("express");
const characterRoutes = require("./characters");
const moviesRoutes = require("./movies");
const userRoutes = require("./users");
const genreRoutes = require("./genre");

const router = express.Router();

router.use("/characters", characterRoutes);
router.use("/movies", moviesRoutes);
router.use("/genre", genreRoutes);
router.use("/auth", userRoutes);

module.exports = router;
