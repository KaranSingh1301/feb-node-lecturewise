const { BLOGSLIMIT } = require("../constants");
const blogsSchema = require("../Schemas/Blogs");
const ObjectId = require("mongodb").ObjectId;

const Blogs = class {
  title;
  textBody;
  userId;
  creationDateTime;
  constructor({ title, textBody, userId, creationDateTime }) {
    this.textBody = textBody;
    this.title = title;
    this.userId = userId;
    this.creationDateTime = creationDateTime;
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
};

module.exports = Blogs;
