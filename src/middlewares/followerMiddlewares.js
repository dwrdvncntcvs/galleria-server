const { User, Follower } = require("../../models");

exports.canFollow = async (req, res, next) => {
  const username = req.params.username;
  const user = req.user;
  const foundUser = await User.findUserByUsername(username);

  if (user.id === foundUser.id)
    return res.status(403).send({ msg: "You can't follow yourself." });

  const isUserFollowed = await Follower.isUserFollowed(foundUser, user);
  if (isUserFollowed)
    return res.status(403).send({
      msg: `You have already followed ${foundUser.first_name} ${foundUser.last_name}`,
    });

  req.foundUser = foundUser;
  next();
};
