const constants = require("../constants");
const followSchema = require("../Schemas/Follow");
const userSchema = require("../Schemas/User");
const ObjectId = require("mongodb").ObjectId;

function followUser({ followerUserId, followingUserId }) {
  return new Promise(async (resolve, reject) => {
    //check if they follow entry exist
    try {
      const followObj = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });

      if (followObj) {
        reject("User alredy follow");
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
}

function followersUserList({ followingUserId, skip }) {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema.aggregate([
        { $match: { followingUserId: followingUserId } },
        { $sort: { creationDateTime: -1 } },
        {
          $facet: {
            data: [{ $skip: parseInt(skip) }, { $limit: constants.LIMIT }],
          },
        },
      ]);

      // console.log(followDb[0].data);
      //sperate the follower userids
      let followersUserIds = [];

      followDb[0].data.forEach(async (obj) => {
        followersUserIds.push(ObjectId(obj.followerUserId));
      });

      //search for followers user details in userSchema

      const userDetails = await userSchema.aggregate([
        {
          $match: { _id: { $in: followersUserIds } },
        },
      ]);
      console.log(followDb[0].data);
      console.log(followersUserIds);
      console.log(userDetails);

      return resolve(userDetails);
    } catch (error) {
      reject(error);
    }
  });
}

function followingUsersList({ followerUserId, skip }) {
  return new Promise(async (resolve, reject) => {
    try {
      // const data = await followSchema
      //   .find({ followerUserId: followerUserId })
      //   .populate("followingUserId");

      const followList = await followSchema.aggregate([
        { $match: { followerUserId: followerUserId } },
        { $sort: { creationDateTime: -1 } },
        {
          $facet: {
            data: [{ $skip: parseInt(skip) }, { $limit: constants.LIMIT }],
          },
        },
      ]);

      let followingUserIds = [];

      followList[0].data.forEach((obj) => {
        followingUserIds.push(ObjectId(obj.followingUserId));
      });

      const followingUserDetails = await userSchema.aggregate([
        {
          $match: { _id: { $in: followingUserIds } },
        },
      ]);

      resolve(followingUserDetails);
    } catch (error) {
      reject(error);
    }
  });
}

function unfollowUser({ followerUserId, followingUserId }) {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });

      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  followUser,
  followingUsersList,
  followersUserList,
  unfollowUser,
};
