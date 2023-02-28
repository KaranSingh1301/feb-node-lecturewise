const blogsSchema = require("../Schemas/Blogs");
const constants = require("../constants");
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
      this.textBody.trim();
      this.textBody.trim();

      const blog = new blogsSchema({
        title: this.title,
        textBody: this.textBody,
        userId: this.userId,
        creationDateTime: this.creationDateTime,
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = Blogs;
