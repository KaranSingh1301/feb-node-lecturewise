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

// `blog/get-blogs?skip=5`
BlogsRouter.get("/get-blogs", async (req, res) => {
  const skip = req.query.skip || 0;

  try {
    const blogsDb = await Blogs.getBlogs({ skip });
    console.log(blogsDb);
    return res.send({
      status: 200,
      message: "Read successfull",
      data: blogsDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Database error",
      error: error,
    });
  }
});

BlogsRouter.get("/my-blogs", async (req, res) => {
  const userId = req.session.user.userId;
  const skip = req.query.skip || 0;

  try {
    await User.verifyUserId({ userId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "User not found",
      error: error,
    });
  }
  console.log("here");
  try {
    const myBlogsDb = await Blogs.getMyBlogs({ skip, userId });

    return res.send({
      status: 200,
      message: "Read successfull",
      data: myBlogsDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Database Error",
      error: error,
    });
  }
});

//edit blog
BlogsRouter.post("/edit-blog", async (req, res) => {
  //find - blogId
  //update - title, texbody
  //userId - session
  //data validation
  //find the blog with blogId
  //Compare blog.userId with the userId that you getting from session
  //compare the time and it should be less than 30 then only allow to update
  //then findoneandupdate
});

module.exports = BlogsRouter;
