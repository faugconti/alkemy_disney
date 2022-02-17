const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next;
  }
  try {
    //   ...authorization: BEARER token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("(401) Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("(401) Authentication Failed!", 401);
    return next(error);
  }
};
