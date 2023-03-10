const mongoose = require("mongoose");
const User = require("../Models/User");
const Schema = mongoose.Schema;

const blogsSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  textBody: {
    type: String,
    required: true,
  },
  creationDateTime: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    require: false,
    default: false,
  },
  deletionDateTime: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("Blogs", blogsSchema);
