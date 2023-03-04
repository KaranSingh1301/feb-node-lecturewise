const express = require("express");
const FollowRouter = express.Router();
const User = require("../Models/User");
const {
  followUser,
  followingUsersList,
  followersUserList,
  unfollowUser,
} = require("../Models/follow");

FollowRouter.post("/follow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  //validate the id's
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
    await User.verifyUserId({ userId: followingUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Following UserId",
      error: err,
    });
  }

  //create a follow entry

  try {
    const followDb = await followUser({ followingUserId, followerUserId });

    return res.send({
      status: 200,
      message: "Follow created Successfully",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 401,
      message: "Database error",
      error: error,
    });
  }

  return res.send(true);
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
        status: 400,
        message: "No one follows you :(",
      });
    }

    return res.send({
      status: 200,
      message: "Read Successfull",
      data: data,
    });
  } catch (error) {
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

  //validate the followerId
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid followerId",
      error: err,
    });
  }

  try {
    const followingUserDetails = await followingUsersList({
      followerUserId,
      skip,
    });

    if (followingUserDetails.length === 0) {
      return res.send({
        status: 400,
        message: "you are not following anyone",
      });
    }

    return res.send({
      status: 200,
      message: "Read successfull",
      data: followingUserDetails,
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

FollowRouter.post("/unfollow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  //validate the id's
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
    await User.verifyUserId({ userId: followingUserId });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Invalid Following UserId",
      error: err,
    });
  }

  try {
    const followDb = await unfollowUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Unfollow the user successfully",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: " Database error",
      error: error,
    });
  }
});

module.exports = FollowRouter;

//test1->test2
//test3->test2
//test4->test2

//test1 -->test3
//test2 -->test3
//test-->test3
//test2-->test1
