const express = require("express");

const app = express();

app.get("/home", (req, res) => {
  return res.send("This is your server");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
