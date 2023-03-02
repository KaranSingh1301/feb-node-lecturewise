const { BLOGSLIMIT } = require("../constants");
const blogsSchema = require("../Schemas/Blogs");
const ObjectId = require("mongodb").ObjectId;

const Blogs = class {
  title;
  textBody;
  userId;
  creationDateTime;
  blogId;
  constructor({ title, textBody, userId, creationDateTime, blogId }) {
    this.textBody = textBody;
    this.title = title;
    this.userId = userId;
    this.creationDateTime = creationDateTime;
    this.blogId = blogId;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.textBody.trim();

      const blog = new blogsSchema({
        title: this.title,
        textBody: this.textBody,
        creationDateTime: this.creationDateTime,
        userId: this.userId,
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  //pagination and sorting
  static getBlogs({ skip }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogsDb = await blogsSchema.aggregate([
          { $sort: { creationDateTime: -1 } },
          {
            $facet: {
              data: [{ $skip: parseInt(skip) }, { $limit: BLOGSLIMIT }],
            },
          },
        ]);
        resolve(blogsDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getMyBlogs({ skip, userId }) {
    return new Promise(async (resolve, reject) => {
      //sort, pagination and matching

      try {
        const myblogDb = await blogsSchema.aggregate([
          { $match: { userId: ObjectId(userId) } },
          { $sort: { creationDateTime: -1 } }, //DESC order of time
          {
            $facet: {
              data: [{ $skip: parseInt(skip) }, { $limit: BLOGSLIMIT }],
            },
          },
        ]);

        resolve(myblogDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  getBlogDataFromId() {
    return new Promise(async (resolve, reject) => {
      console.log("here", this.blogId);
      try {
        const blogDb = await blogsSchema.findOne({
          _id: ObjectId(this.blogId),
        });
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateBlog() {
    return new Promise(async (resolve, reject) => {
      try {
        let newBlogData = {};

        if (this.title) {
          newBlogData.title = this.title;
        }

        if (this.textBody) {
          newBlogData.textBody = this.textBody;
        }

        const oldData = await blogsSchema.findOneAndUpdate(
          { _id: ObjectId(this.blogId) },
          newBlogData
        );

        resolve(oldData);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteBlog() {
    return new Promise(async (resolve, reject) => {
      try {
        const blogData = await blogsSchema.findOneAndDelete({
          _id: ObjectId(this.blogId),
        });
        resolve(blogData);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = Blogs;
