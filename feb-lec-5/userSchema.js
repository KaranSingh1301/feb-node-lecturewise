const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name1: {
    type: String,
    require: true,
  },
  email1: {
    type: String,
    require: true,
    unique: true,
  },
  password1: {
    type: String,
    require: true,
  },
  tele1: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("Users", userSchema);
