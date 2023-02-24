const express = require("express");
const cleanUpAndValidate = require("../utils/AuthUtils");
const AuthRouter = express.Router();
const User = require("../Models/userModel");

//auth/register
AuthRouter.post("/register", (req, res) => {
  const { name, email, password, username } = req.body;

  //data validation
  cleanUpAndValidate({ name, username, password, email })
    .then(async () => {
      console.log(req.body);

      //create an obj of user class
      const user = new User({
        email,
        password,
        name,
        username,
      });

      try {
        const userDb = await user.registerUser();
        console.log(userDb);

        return res.send({
          status: 200,
          message: "User Created successfully",
          data: userDb,
        });
      } catch (error) {
        return res.send({
          status: 400,
          message: "Error in credentials",
          error: error,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.send({
        status: 400,
        message: "Error in credentials",
        error: err,
      });
    });
});

//auth/login
AuthRouter.post("/login", (req, res) => {
  console.log("login");
  return res.send(true);
});

module.exports = AuthRouter;
