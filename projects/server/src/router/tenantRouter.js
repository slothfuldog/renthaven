const {uploader} = require("../config/uploader");
const route = require("express").Router();
const { tenantController } = require("../controller");


route.post("/signup/new-tenant", uploader("/ktpImg", "IMGKTP").array('images', 1), tenantController.registerTenant);

module.exports = route