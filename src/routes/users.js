const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { login, signup } = require("../controllers/users");

const validator = [
  check("email").normalizeEmail().isEmail().exists(),
  check("password").isString().isLength({ min: 6 }).exists(),
];

router.post("/login", validator, login);
router.post("/register", validator, signup);

module.exports = router;
