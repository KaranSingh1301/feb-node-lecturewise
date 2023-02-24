const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("users", userSchema);
