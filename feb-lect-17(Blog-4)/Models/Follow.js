const { BLOGSLIMIT } = require("../constants");
const followSchema = require("../Schemas/Follow");
const userSchema = require("../Schemas/User");
const ObjectId = require("mongodb").ObjectId;

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    //check if the follow entry exits or not
    try {
      const followDb = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });

      if (followDb) {
        reject("User already follow");
      }

      //create a new entry
      const follow = new followSchema({
        followerUserId,
        followingUserId,
        creationDateTime: new Date(),
      });

      try {
        const followDb = await follow.save();
        resolve(followDb);
      } catch (error) {
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
};

function followersUserList({ followingUserId, skip }) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(followingUserId);
      const db = await followSchema.find({ followingUserId: followingUserId });
      //   const followDb = await followSchema.aggregate([
      //     { $match: { followingUserId: followingUserId } },
      //     { $sort: { creationDateTime: -1 } },
      //     {
      //       $facet: {
      //         data: [{ $skip: parseInt(skip) }, { $limit: BLOGSLIMIT }],
      //       },
      //     },
      //   ]);

      console.log(db);
      return resolve(db);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { followUser, followersUserList };
