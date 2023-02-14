const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file imports
const { cleanUpAndValidate } = require("./utils/AuthUtils");
const UserSchema = require("./UserSchema");
const { isAuth } = require("./middleware/authMiddleware");

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

const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: "This is your todo APP",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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

      return res.status(200).redirect("/login");
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

app.post("/login", async (req, res) => {
  //console.log(req.body);
  //validate data
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  if (typeof loginId !== "string" || typeof password !== "string") {
    return res.send({
      status: 400,
      message: "Invalid data format",
    });
  }

  //identify the loginId and searched in the DB
  try {
    let userDb;
    if (validator.isEmail(loginId)) {
      userDb = await UserSchema.findOne({ email: loginId });
    } else {
      userDb = await UserSchema.findOne({ username: loginId });
    }

    //if user is not present
    if (!userDb) {
      return res.send({
        status: 402,
        message: "UserId does not exsit",
      });
    }

    //validate the password
    const isMatch = await bcrypt.compare(password, userDb.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.send({
        status: 402,
        message: "Password does not match",
      });
    }

    req.session.isAuth = true;
    req.session.user = {
      username: userDb.username,
      email: userDb.email,
      userId: userDb._id,
    };

    return res.status(200).redirect("/dashboard");
  } catch (error) {
    return res.send({
      status: 401,
      message: "Data base error",
      error: error,
    });
  }

  //user.password
  //match the password (plaintextpassword,user.password)
});

// app.get("/homepage", isAuth, (req, res) => {
//   return res.send("This is your homepage");
// });

app.get("/dashboard", isAuth, (req, res) => {
  return res.render("dashboard");
});

app.post("/logout", isAuth, (req, res) => {
  console.log(req.session);

  req.session.destroy((err) => {
    if (err) throw err;

    res.redirect("/login");
  });
});

app.post("/logout_from_all_devices", isAuth, async (req, res) => {
  const username = req.session.user.username;

  //create a session schema
  const Schema = mongoose.Schema;
  const sessionSchema = new Schema({ _id: String }, { strict: false });
  const sessionModel = mongoose.model("session", sessionSchema);

  try {
    const sessionDbDeletedCount = await sessionModel.deleteMany({
      //key:value
      "session.user.username": username,
    });

    console.log(sessionDbDeletedCount);

    return res.send({
      status: 200,
      message: "Logout from all devices successfully",
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Logout unsuccessfull",
      error: error,
    });
  }

  return res.send(true);
});

app.listen(PORT, () => {
  console.log(clc.yellow("App is running at "));
  console.log(clc.blue.underline(`http://localhost:${PORT}`));
});

//Registeration Page
//UI
//Get and Post
//User creation in Db

//Login
//UI
//Get and Post
//Comparison of password

//Session bases Auth
//isAuth middleware

//Dashboard Page
//UI
//logout
//logout from all devices

//backend
//todo Schema
//route to create a todo
//route to edit a todo
//route to delete a todo

//browser.js
//axios  create, read, update, delete. (CRUD) (Frontend)

//optimization
//pagination
//rate-limiting
