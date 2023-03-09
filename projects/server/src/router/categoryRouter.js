const route = require("express").Router();
const { categoryController } = require("../controller");

route.post("/category/regis", categoryController.regis);
route.get("/category", categoryController.getData);

module.exports = route;
