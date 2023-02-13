const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//file imports
const { cleanUpAndValidate } = require("./utils/AuthUtils");
const UserSchema = require("./UserSchema");

const app = express();
const PORT = process.env.PORT || 8000;
const saltRound = 10;

app.set("view engine", "ejs");
mongoose.set("strictQuery", true);

//mongoDb connection
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/feb-todo`;
mongoose
  .connect(MONGO_URI)
  .then((res) => {
    console.log(clc.yellow("Connected to mongoDb"));
  })
  .catch((err) => {
    console.log(clc.red(err));
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  return res.send("This is your TODO APP");
});

app.get("/register", (req, res) => {
  return res.render("register");
});

app.get("/login", (req, res) => {
  return res.render("login");
});

app.post("/register", async (req, res) => {
  const { name, email, password, username } = req.body;

  //data cleaning
  try {
    await cleanUpAndValidate({ name, email, username, password });

    //check if the user exits

    let userExits;
    try {
      userExits = await UserSchema.findOne({ email });
    } catch (error) {
      return res.send({
        status: 401,
        message: "Data Base error",
        error: error,
      });
    }
    console.log(userExits);
    if (userExits) {
      return res.send({
        status: 400,
        message: "User already exits",
      });
    }

    //create user and store inside database

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const user = new UserSchema({
      name: name,
      email: email,
      password: hashedPassword,
      username: username,
    });

    try {
      const userDb = await user.save();
      console.log(userDb);

      return res.send({
        status: 200,
        message: "User created successfully",
        data: userDb,
      });
    } catch (error) {
      return res.send({
        status: 401,
        message: "Data Base error",
        error: error,
      });
    }
  } catch (error) {
    return res.send({
      status: 401,
      error: error,
    });
  }
});

app.post("/login", (req, res) => {
  //validate data
  //what is loginId(email, username)
  //find the user from the database with email || username
  //user.password
  //match the password (plaintextpassword,user.password)
});

app.listen(PORT, () => {
  console.log(clc.yellow("App is running at "));
  console.log(clc.blue.underline(`http://localhost:${PORT}`));
});
