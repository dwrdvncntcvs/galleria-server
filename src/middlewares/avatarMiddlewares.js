const { Avatar } = require("../../models");
const fs = require("fs");

const EMPTY = "";

exports.checkIfAvatarExist = async (req, res, next) => {
  const { userId } = req.params;

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

exports.removeAvatarImage = async (req, res, next) => {
  const id = req.params.id;

  const foundAvatar = await Avatar.findAvatarByUserId(id);
  if (!foundAvatar) return res.status(404).send({ msg: "Avatar not found." });

  fs.unlink(`images/avatars/${foundAvatar.filename}`, (err) => {
    if (err) console.log(err);
  });

  next();
};
