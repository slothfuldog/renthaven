const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "purwadhikarenthaven@gmail.com",
    pass: "jwazrbgdaorepmwq",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

module.exports = {
  transport,
};
