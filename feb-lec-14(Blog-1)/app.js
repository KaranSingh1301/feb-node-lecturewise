const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
require("dotenv").config();

//file-imports
const db = require("./db");
const AuthRouter = require("./Controllers/AuthController");

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());

//routes
app.get("/", (req, res) => {
  return res.send("This is your Blogging App.");
});

app.use("/auth", AuthRouter);
// /auth/register

app.listen(PORT, () => {
  console.log(clc.bgBlue("Server is running at"));
  console.log(clc.yellow(`http://localhost:${PORT}`));
});
