const {
    encryptPassword,
    createToken
} = require("../config/encrypt");
const {
    userModel
} = require("../model");
const bcrypt = require("bcrypt")

module.exports = {
    registerAcc: async (req, res) => {
        console.log(req.body.regis)
        try {
            let data = await userModel.findAll({
                where: {
                    email: req.body.email
                }
            });
            if (data.length > 0) {
                res.status(200).send({
                    success: false,
                    message: "The email has been registered"
                })
            } else {
                let length = 21,
                    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*#?&",
                    randomString = "";
                for (let i = 0, n = charset.length; i < length; ++i) {
                    randomString += charset.charAt(Math.floor(Math.random() * n));
                }
                const encryptedPassword = (req.body.regis == "firebase") ? encryptPassword(randomString) : encryptPassword(req.body.password);
                let data1 = await userModel.create({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: encryptedPassword,
                });
                res.status(200).send({
                    success: true,
                    message: "Registration Success!"
                })
            }
        } catch (error) {
            console.log(error);
            res.status(501).send({
                success: false,
                message: req.body.name
            })
        }
    },
    checkDuplicate: async (req, res) => {
        try {
            let data = await userModel.findAll({
                where: {
                    email: req.body.email
                }
            });
            if (data.length > 0) {
                res.status(200).send({
                    success: false,
                    message: "The email has been registered"
                })
            } else {
                res.status(200).send({
                    success: true,
                    message: "Email has not been registered"
                })
            }
        } catch (error) {

        }
    },
    loginUser: async (req, res) => {
        try {
            const data = await userModel.findAll({
                where: {
                    email: req.body.email
                }
            })
            let token = createToken({
                ...data,
                login: req.body.login
            });
            if (data.length > 0) {
                if (req.body.login == "firebase") {
                    res.status(200).send({
                        success: true,
                        message: "Login successfull",
                        result: data[0],
                        token
                    })
                } else if (req.body.login != "firebase") {
                    const checkPass = bcrypt.compareSync(req.body.password, data[0].password);
                    if (checkPass) {
                        res.status(200).send({
                            success: true,
                            message: "Login successfull",
                            result: data[0],
                            token
                        })
                    } else {
                        res.status(403).send({
                            success: false,
                            message: "Username or password invalid"
                        })
                    }
                } else {
                    res.status(403).send({
                        success: false,
                        message: "Username or password invalid"
                    })
                }
            } else {
                res.status(403).send({
                    success: false,
                    message: "Username or password invalid"
                })
            }
        } catch (error) {
            console.log(error);
            res.status(501).send({
                success: false,
                message: "Database error",
                error
            })
        }
    }
}