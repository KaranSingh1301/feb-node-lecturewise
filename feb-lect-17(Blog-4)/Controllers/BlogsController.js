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

BlogsRouter.post("/edit-blog", async (req, res) => {
  const { title, textBody } = req.body.data;
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  //data validation

  BlogsDataValidate({ title, textBody, userId })
    .then(async () => {
      const blog = new Blogs({ title, textBody, userId, blogId });
      //find the blog
      const blogDb = await blog.getBlogDataFromId();

      //validate the blog owner and the user making the edit request
      // if(blogDb.userId.toString() === userId.toString())
      if (!blogDb.userId.equals(userId)) {
        return res.send({
          status: 400,
          message: "Not allow to edit",
        });
      }

      //put the check to allow only to edit within 30 mins of creation
      const creationDatetime = new Date(blogDb.creationDateTime);
      const currentDateTime = Date.now();

      const diff = (currentDateTime - creationDatetime) / (1000 * 60);

      if (diff > 30) {
        return res.send({
          status: 402,
          message: "Edit Unsuccessfull",
          error: "Can not edit after 30 mins of creation",
        });
      }

      //everything is fine allow the user to update the blog
      const oldData = await blog.updateBlog();

      return res.send({
        status: 400,
        message: "Updated successfully",
        data: oldData,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.send({
        status: 400,
        message: "Error occurred",
        error: error,
      });
    });

  //then findoneandupdate
});

BlogsRouter.post("/delete-blog", async (req, res) => {
  //blogId
  //userId

  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    //get the blog from blogId
    const blog = new Blogs({ blogId, userId });
    const blogDb = await blog.getBlogDataFromId();
    console.log(blogDb);

    //check the owner ship
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 400,
        message: "Not allow to delete. Authorization Failed",
      });
    }

    const blogData = await blog.deleteBlog();

    return res.send({
      status: 200,
      message: "Deleted Successfully",
      data: blogData,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Error occured",
      error: error,
    });
  }
});

module.exports = BlogsRouter;
