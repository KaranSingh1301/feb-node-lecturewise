//ES5
const express = require("express");

const app = express();

//api
app.get("/home", (req, res) => {
  //BL
  console.log("GET HOME REQUEST");
  return res.send("This is your server");
});

app.post("/signup", (req, res) => {
  return res.send("This is your post");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
