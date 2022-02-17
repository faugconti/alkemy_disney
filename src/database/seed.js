const fs = require("fs");
const sequelize = require("./database");
require("../models/associations");
const populateScript = fs.readFileSync(__dirname + "/seed.sql", "utf8");

(async () => {
  try {
    await sequelize.sync({ force: true });
    await sequelize.query(populateScript);
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
})();
