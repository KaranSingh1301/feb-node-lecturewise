const express = require("express");
const {
  followUser,
  followersUserList,
  followingUsersList,
} = require("../Models/Follow");
const FollowRouter = express.Router();
const User = require("../Models/User");

FollowRouter.post("/follow-user", async (req, res) => {
  const followingUserId = req.body.followingUserId;
  const followerUserId = req.session.user.userId;

  //validate the id's
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Follower UserId",
      error: error,
    });
  }

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Following UserId",
      error: error,
    });
  }

  //create an entry in followSchema
  try {
    const followDb = await followUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Follow successfully",
      data: followDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Follow Unsuccessfully",
      error: error,
    });
  }
});

FollowRouter.post("/followers-list", async (req, res) => {
  const followingUserId = req.session.user.userId;
  const skip = req.query.skip || 0;

  //validate the userid
  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid UserId",
      error: err,
    });
  }

  try {
    const data = await followersUserList({ followingUserId, skip });

    if (data.length === 0) {
      return res.send({
        status: 200,
        message: "No follows you :(",
      });
    }

    return res.send({
      status: 200,
      message: "Read Successfull",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Read Unsuccessfull",
      error: error,
    });
  }
});

FollowRouter.post("/following-list", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const skip = req.query.skip || 0;

  //validate the userid
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Follower UserId",
      error: err,
    });
  }

  try {
    const data = await followingUsersList({ followerUserId, skip });
    // console.log(data);

    if (data.length === 0) {
      return res.send({
        status: 200,
        message: "You have not followed anyone yet",
      });
    }

    return res.send({
      status: 200,
      message: "Read Successfull",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Read Unsuccessfull",
      error: error,
    });
  }
});

module.exports = FollowRouter;

//test1
//test2
//test3
//test4

//test1-->test2
//test3-->test2
//test4-->test2
//test2-->test1

//follower List of test2
//test1, test3, test4

//following list of test2
//test1
