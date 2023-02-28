const express = require("express");
const BlogsRouter = express.Router();
const Blogs = require("../Models/Blogs");
const User = require("../Models/User");
const BlogsDataValidate = require("../utils/BlogsUtils");

BlogsRouter.post("/create-blog", (req, res) => {
  const title = req.body.title;
  const textBody = req.body.textBody;
  const userId = req.session.user.userId;
  const creationDateTime = new Date();

  //data cleaning
  BlogsDataValidate({ title, textBody, userId })
    .then(async () => {
      try {
        await User.verifyUserId({ userId });

        //create a blog
        const blog = new Blogs({ title, textBody, userId, creationDateTime });

        try {
          const blogDb = await blog.createBlog();

          return res.send({
            status: 200,
            message: "Blog created successfully",
            data: blogDb,
          });
        } catch (err) {
          return res.send({
            status: 402,
            message: "Error Occurred",
            error: err,
          });
        }
      } catch (error) {
        console.log(error);
        return res.send({
          status: 402,
          message: "Error Occurred",
          error: error,
        });
      }
    })
    .catch((error) => {
      return res.send({
        status: 401,
        message: "Error occured",
        error: error,
      });
    });
});

module.exports = BlogsRouter;
