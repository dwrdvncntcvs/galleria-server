const { Avatar } = require("../../models");
const { isUuidValid } = require("../utils/validation");
const fs = require("fs");

const EMPTY = "";

exports.checkIfAvatarExist = async (req, res, next) => {
  const userId = req.params.userId;
  const currentUser = req.user;

  if (!isUuidValid(userId))
    return res.status(400).send({ msg: "User doesn't exist." });

  if (currentUser.id !== userId)
    return res.status(403).send({ msg: "You have no access to this profile" });

  const avatar = await Avatar.findAvatarByUserId(userId);
  if (!avatar) return res.status(404).send({ msg: "Avatar not found." });

  const { filename, path, mimetype, size } = avatar;
  if (
    filename !== EMPTY ||
    path !== EMPTY ||
    mimetype !== EMPTY ||
    size !== EMPTY
  )
    fs.unlink(`images/avatars/${filename}`, (err) => {
      if (err) console.log(err);
    });

  next();
};
