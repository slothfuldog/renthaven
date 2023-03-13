const { encryptPassword, createToken } = require("../config/encrypt");
const { userModel } = require("../model");
const bcrypt = require("bcrypt");

module.exports = {
  registerAcc: async (req, res) => {
    try {
      let data = await userModel.findAll({
        where: {
          email: req.body.email,
        },
      });
      if (data.length > 0) {
        res.status(403).send({
          success: false,
          message: "The email has been registered",
        });
      } else {
        let length = 21,
          charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*#?&",
          randomString = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
          randomString += charset.charAt(Math.floor(Math.random() * n));
        }
        const encryptedPassword =
          req.body.provider != "common"
            ? encryptPassword(randomString)
            : encryptPassword(req.body.password);
        let data1 = await userModel.create({
          name: req.body.name,
          email: req.body.email.toLowerCase(),
          phone: req.body.phone,
          password: encryptedPassword,
          provider: req.body.provider,
        });
        res.status(200).send({
          success: true,
          message: "Registration Success!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(501).send({
        success: false,
        message: "Database error",
      });
    }
  },
  checkDuplicate: async (req, res) => {
    try {
      let data = await userModel.findAll({
        where: {
          email: req.body.email,
        },
      });
      if (data.length > 0) {
        res.status(403).send({
          success: false,
          message: "The email has been registered",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Email has not been registered",
        });
      }
    } catch (error) {}
  },
  loginUser: async (req, res) => {
    try {
      const data = await userModel.findAll({
        where: {
          email: req.body.email,
        },
      });
      let token = createToken({
        ...data,
      });
      if (data.length > 0) {
        if (req.body.login != "common") {
          res.status(200).send({
            success: true,
            message: "Login successfull",
            result: data[0],
            token,
          });
        } else if (req.body.login == "common") {
          const checkPass = bcrypt.compareSync(req.body.password, data[0].password);
          if (checkPass) {
            res.status(200).send({
              success: true,
              message: "Login successfull",
              result: data[0],
              token,
            });
          } else {
            res.status(200).send({
              success: false,
              message: "Username or password invalid",
            });
          }
        } else {
          res.status(200).send({
            success: false,
            message: "Username or password invalid",
          });
        }
      } else {
        res.status(200).send({
          success: false,
          message: "Username or password invalid",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(501).send({
        success: false,
        message: "Database error",
        error,
      });
    }
  },
  keepLogin: async (req, res) => {
    try {
      const data = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      console.log(data[0].isVerified);
      let token = createToken({
        ...data,
      });
      console.log(req.decrypt);
      if (data.length > 0) {
        return res.status(200).send({
          success: true,
          result: data[0],
          token,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  verifyAcc: async (req, res) => {
    try {
      // read token user logging in
      // update user
      const { otp, phone } = req.body;
      console.log(req.decrypt);
      let user = await userModel.findOne({
        where: { email: req.decrypt.email },
      });
      console.log(user);

      if (user.otp !== otp) {
        return res.status(400).send({
          success: false,
          message: "OTP is not correct.",
        });
      }
      const phoneNum = user.provider == "common" ? user.phone : phone;
      let userUpdate = await userModel.update(
        { isVerified: 1, phone: phoneNum },
        {
          where: { email: req.decrypt.email },
        }
      );
      res.status(200).send({
        success: true,
        message: "Your account is verified",
        userUpdate,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "An error occured while verifying account.",
        error,
      });
    }
  },
  changePass: async (req, res) => {
    try {
      const { oldPass, password, email } = req.body;
      const data = await userModel.findAll({
        where: {
          email: email,
        },
      });
      if (data[0].provider !== "common") {
        return res.status(403).send({
          success: false,
          message: `We're sorry but you cannot change your password if you login with ${data[0].provider} account`,
        });
      }

      const check = bcrypt.compareSync(oldPass, data[0].password);

      if (check) {
        const pass = encryptPassword(password);
        const update = await userModel.update(
          { pass },
          {
            where: {
              email: email,
            },
          }
        );
        if (update) {
          return res.status(200).send({
            success: true,
            message: `Your password has been successfully changed`,
          });
        }
      } else {
        return res.status(403).send({
          success: false,
          message: `Your current password is incorrect`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
