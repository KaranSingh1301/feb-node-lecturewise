const cron = require("node-cron");
const blogsSchema = require("./Schemas/Blogs");

function cleanUpBin() {
  cron.schedule("* 1 * * *", async () => {
    //find all the blogs where isDeleted : true

    const deletedBlogsDb = await blogsSchema.aggregate([
      { $match: { isDeleted: true } },
    ]);

    // console.log(deletedBlogsDb.length);

    if (deletedBlogsDb.length > 0) {
      deletedBlogsDb.forEach(async (blog) => {
        const deletetionDateTime = new Date(blog.deletionDateTime).getTime();
        const currentDateTime = Date.now();

        const diff =
          (currentDateTime - deletetionDateTime) / (1000 * 60 * 60 * 24);
        // console.log(blog._id, diff);
        if (diff >= 30) {
          await blogsSchema
            .findOneAndDelete({ _id: blog._id })
            .then(() => {
              console.log(`Blog has been deleted successfully : ${blog._id}`);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  });
}

module.exports = { cleanUpBin };
