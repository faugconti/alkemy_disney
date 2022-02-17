const express = require("express");
const isAuth = require("../middleware/isAuth");
const { query, param, body } = require("express-validator");
const characterController = require("../controllers/characters");
const router = express.Router();

const updateValidator = [
  body("name").isString({ min: "2" }).optional(),
  body("age").isInt({ min: 1 }).optional(),
  body("weight").isFloat({ min: 1 }).optional(),
  body("history").isString({ min: 1 }).optional(),
  body("image").isURL().optional(),
];

const createValidator = [
  body("name").isString({ min: "2" }).exists(),
  body("age").isInt({ min: 1 }).exists(),
  body("weight").isFloat({ min: 1 }).exists(),
  body("history").isString({ min: 1 }).exists(),
  body("image").isURL().optional(),
  body("media").isArray().optional(),
];

router.get(
  "/",
  [
    query("name").isString().optional().isLength({ min: 1 }),
    query("movies").isInt({ min: 1 }).optional(),
    query("age").isInt({ min: 0 }).optional(),
  ],
  characterController.getCharacters
);
router.get(
  "/:id",
  [param("id").isInt({ min: 1 })],
  characterController.getCharacterById
);
router.use("/", isAuth);
router.post("/", createValidator, characterController.createCharacter);
router.patch(
  "/:id",
  [param("id").isInt({ min: 1 })],
  updateValidator,
  characterController.updateCharacter
);
router.delete(
  "/:id",
  [param("id").isInt({ min: 1 })],
  characterController.deleteCharacter
);

module.exports = router;
