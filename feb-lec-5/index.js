const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file import
const userSchema = require("./userSchema");

const app = express();

//mongodb connection
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/testDb`;

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("mongoDb connected");
  })
  .catch((err) => {
    console.log(err);
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
    secret: "This is our feb nodejs class",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//API
app.get("/", (req, res) => {
  return res.send("This is your server");
});

app.post("/post", (req, res) => {
  return res.send("This is your post request");
});

//return html
app.get("/myhtml", (req, res) => {
  return res.send(`<html>
    <head></head>
    <body>
    <h3>This is FORM</h3>

    <form action="/form_submit" method="POST"> 
    <label for="name">Name</label>
    <input type="text" name="name"></input>

    <label for="email">Email</label>
    <input type="text" name="email"></input>

    <label for="tele">Tele</label>
    <input type="text" name="tele"></input>

    <label for="password">Password</label>
    <input type="text" name="password"></input>
    <button type="submit">Submit</button>
    </form>

    </body>
    </html>`);
});

app.post("/form_submit", async (req, res) => {
  console.log(req.body);
  const { name, email, password, tele } = req.body;
  const user = new userSchema({
    name1: name,
    email1: email,
    password1: password,
    tele1: tele,
  });

  try {
    const userDb = await user.save();
    console.log(userDb);

    //store the session in Db
    req.session.isAuth = true;

    return res.send("User created successfully");
  } catch (err) {
    console.log(err);
    return res.send("Database error");
  }
});

app.get("/gym", (req, res) => {
  console.log(req.session.id);
  if (req.session.isAuth) {
    return res.send("This is your gym page");
  } else {
    return res.send("Invalid session, restricted page");
  }
});

app.listen(8000, () => {
  console.log("Server is runnung on PORT 8000");
});

//mongoose-->Schema (userSchema) --> userObj.save()
