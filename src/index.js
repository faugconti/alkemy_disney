const express = require("express");
const routes = require("./routes");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const sequelize = require("./database/database");
require("dotenv").config();
require("./models/associations");
const swaggerFile = require("./openapi.json");

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);
app.use("/api", routes);
app.use("/api/documentation", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use((error, req, res, next) => {
  console.log("[ERROR HANDLER]");
  console.log(error);
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Server Error!" });
});

sequelize.sync().then(() => app.listen(process.env.PORT, "localhost"));
