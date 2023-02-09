const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    <button type="submit">Submit</button>
    </form>

    </body>
    </html>`);
});

app.post("/form_submit", (req, res) => {
  console.log(req.body);
  return res.send("Form submitted successfully");
});

app.listen(8000, () => {
  console.log("Server is runnung on PORT 8000");
});
