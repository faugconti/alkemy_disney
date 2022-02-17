const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { login, signup } = require("../controllers/users");

router.post("/login", login);
router.post(
  "/register",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isString().isLength({ min: 6 }),
  ],
  signup
);

module.exports = router;
