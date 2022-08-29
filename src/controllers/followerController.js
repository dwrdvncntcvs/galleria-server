const { sequelize, User, Follower } = require("../../models");
const { errorMessage } = require("../utils/error");

exports.followUser = async (req, res) => {
  const user = req.user;
  const foundUser = req.foundUser;

  const t = await sequelize.transaction();
  try {
    await Follower.create(
      { userId: foundUser.id, followerId: user.id },
      { transaction: t }
    );
    await t.commit();

    return res.send({
      msg: `Successfully followed ${foundUser.first_name} ${foundUser.last_name}`,
    });
  } catch (err) {
    console.log(err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.getFollower = async (req, res) => {
  const username = req.params.username;

  try {
    const foundUser = await User.findUserByUsername(username);
    const followers = await Follower.getFollowers(foundUser.id);
    return res.status(200).send({
      msg: `${foundUser.first_name}'s Followers`,
      followers,
    });
  } catch (err) {
    return res.status(500).send({ msg: "Something went wrong." });
  }
};

exports.getFollowing = async (req, res) => {
  const username = req.params.username;

  try {
    const foundUser = await User.findUserByUsername(username);
    const following = await Follower.getFollowing(foundUser.id);
    return res.status(200).send({
      msg: `${foundUser.first_name}'s Following`,
      following,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong." });
  }
};

exports.unFollowUser = async (req, res) => {
  const foundUser = req.foundUser;

  const t = await sequelize.transaction();
  try {
    await Follower.unfollowUser({ userData: foundUser, transaction: t });

    return res.status(200).send({
      msg: `You successfully unfollow ${foundUser.first_name} ${foundUser.last_name}`,
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res
      .status(500)
      .send({ msg: "Something went wrong.", err: err.message });
  }
};
