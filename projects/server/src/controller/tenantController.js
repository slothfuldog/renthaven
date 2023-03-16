const { encryptPassword, createToken } = require("../config/encrypt");
const { tenantModel, userModel } = require("../model");
const {Op} = require("sequelize")
const bcrypt = require("bcrypt");
const { transport } = require("../config/nodemailer");


function generateOTP() {
    let length = 4,
      charset = "0123456789",
      otp = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      otp += charset.charAt(Math.floor(Math.random() * n));
    }
    return otp;
  }

module.exports = {
    registerTenant : async (req, res) => {
        try {
            const otp = generateOTP();
            let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            const {email, password, name, phone, noKtp, ktpImg} = req.body
            const data = await userModel.findAll({
                where: {
                    email 
                }
            })
            const dataTenant = await tenantModel.findAll({
              where: {
                noKtp
              }
            })
            if(data.length > 0){
                return res.status(403).send({
                    success: false,
                    message: "Email had already been registered"
                })
            }else if(dataTenant.length > 0){
                return res.status(403).send({
                  success: false,
                  message: "KTP / ID card number had been registered"
                })
            }else{
                const encryptedPassword = encryptPassword(password);
                const data1 = await userModel.create({
                        name: name,
                        email: email,
                        phone: phone,
                        password: encryptedPassword,
                        otp,
                        expiredOtp: tomorrow,
                        countOtp: 1,
                        provider: "common",
                        role: "tenant"
                })
                const data2 = await userModel.findOne({
                    where: {
                        email: email
                    }
                })
                console.log(data2.userId, req.files)
                const data3 = await tenantModel.create({
                    userId: data2.userId,
                    noKtp: noKtp,
                    ktpImg: `/ktpImage/${req.files[0].filename}`
                })
                transport.sendMail(
                    {
                      from: "Renthaven Admin",
                      to: email,
                      subject: "Tenant Account Verification",
                      html: `<div>
                      <h5>Here's your OTP. Please login and input your OTP</h5>
                      <h3>${otp}</h3>
                      <a href="http://localhost:3000/tenant/verify"><p>Please click here to verify your OTP</p></a>
                      </div>`,
                    },
                    (error, info) => {
                      if (error) {
                        return res.status(401).send(error);
                      }
                    }
                  );
                  return res.status(200).send({
                    success: true,
                    message: "Tenant account created"
                  })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message: "Database Error"
            })
        }
    },
    loginTenant: async (req, res) => {
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
          if(data.role == "user"){
            return res.status(401).send({
              success: false,
              message: "The account is not a tenant, please login by using your tenant account"
            })
          }
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
      } catch (error) {
        console.log(error);
        res.status(501).send({
          success: false,
          message: "Database error",
          error,
        });
      }
    },
    
}