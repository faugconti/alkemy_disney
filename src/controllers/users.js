const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/User");
const sendEmail = require("../services/emailService");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }

  const useEmailService = process.env.EMAIL_FLAG;

  const { email, password } = req.body;
  let existingUser;
  try {
    //search user in DB;
    existingUser = await User.findOne({ where: { email } });
  } catch (err) {
    const error = new HttpError("(500) Could not create user.", 500);
    return next(error);
  }
  //user already registered
  if (existingUser) {
    const error = new HttpError(
      "(422) User already exists!, login instead",
      422
    );
    next(error);
  }
  //if not registered already:
  let hashedPassword;
  try {
    //hash the password
    const salt = bcrypt.genSaltSync(10);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (err) {
    console.log("after hash");
    console.log(err);
    const error = new HttpError("(500) Could not create user.", 500);
    return next(error);
  }
  try {
    const id = await User.create({ email, password: hashedPassword });
    console.log(id);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "(500) Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  // token generation for JWT
  let token;
  try {
    token = jwt.sign(
      {
        email: email,
      },
      `${process.env.JWT_KEY}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "(500) Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  // send email
  if (useEmailService) {
    try {
      await sendEmail(email);
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "(202) User created. Login for access code..",
        202
      );
      return next(error);
    }
  }

  res.status(201).json({
    email: email,
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    //get from DB
    existingUser = await User.findOne({ where: { email } });
  } catch (err) {
    const error = new HttpError(
      "(500 )Loggin in failed,please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials, could not log in", 403);
    return next(error);
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    console.log(isValidPassword);
    console.log("ERROR VALID PASSWORD");
    const error = new HttpError(
      "(401) Could not log in, please check your credentials",
      401
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("(401) Invalid credentails.", 401);
    return next(error);
  }
  let token;

  try {
    (token = jwt.sign(
      {
        email: existingUser.email,
      },
      `${process.env.JWT_KEY}`
    )),
      { expiresIn: "1h" };
  } catch (err) {
    const error = new HttpError(
      "(500) Log in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    email: existingUser.email,
    token,
  });
};

module.exports = {
  login,
  signup,
};
