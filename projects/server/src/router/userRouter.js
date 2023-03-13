const { tokenVerify } = require("../config/encrypt");
const { checkUser } = require("../config/validator");
const { userController } = require("../controller");
const route = require("express").Router();

route.post("/signup/new-user", checkUser, userController.registerAcc);
route.post("/signup/user", userController.checkDuplicate);
route.post("/signin/", userController.loginUser);
route.post("/signin/keep-login", tokenVerify, userController.keepLogin);
route.post("/verify", tokenVerify, userController.verifyAcc);
route.post("/sendotp", tokenVerify, userController.sendOtp);
route.patch("/user/change-password", checkUser, userController.changePass);

module.exports = route;
