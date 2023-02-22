const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const cleanUpAndValidate = ({ name, email, password, username }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !name || !password) {
      reject("Missing credentials");
    }
    if (typeof email !== "string") reject("Invalid Email");
    if (typeof username !== "string") reject("Invalid Username");
    if (typeof password !== "string") reject("Invalid Password");

    if (!validator.isEmail(email)) reject("Invalid Email Format");

    if (username.length <= 2 || username.length > 50)
      reject("Username should be 3 to 50 char");

    if (password.length <= 2 || username.length > 25)
      reject("password should be 3 to 25 char");

    resolve();
  });
};

const SECRET_KEY = "This is feb nodejs class";

const generateJWTToken = (email) => {
  const JWT_TOKEN = jwt.sign({ email: email }, SECRET_KEY, {
    expiresIn: "15d",
  });
  return JWT_TOKEN;
};

const sendVerificationToken = (email, verificationToken) => {
  console.log(email, verificationToken);

  let mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: "kssinghkaran13@gmail.com",
      pass: "ggoywuqiehtfdnzg",
    },
  });

  let mailOptions = {
    from: "Todo App pvt lmt",
    to: email,
    subject: "Email verification for TODO APP",
    html: `click <a href="http://localhost:8000/verify/${verificationToken}">Here</a>`,
  };

  mailer.sendMail(mailOptions, function (err, response) {
    if (err) throw err;
    else console.log("Mail has been sent successfully");
  });
};

module.exports = {
  cleanUpAndValidate,
  generateJWTToken,
  sendVerificationToken,
  SECRET_KEY,
};
