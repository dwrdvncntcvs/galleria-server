const { TEXT, IMAGE, JPEG, JPG, PNG } = require("../utils/constant");
const fs = require("fs");
const { Post } = require("../../models");

exports.hasText = (type) => (req, res, next) => {
  const { content } = req.body;

  switch (type) {
    case TEXT:
      if (content === null || content === "")
        return res.status(403).send({ msg: "Content should not be empty." });
      return next();
    case IMAGE:
      return next();
    default:
      return;
  }
};

exports.isImageValid = (location) => (req, res, next) => {
  const file = req.file;

  if (!file) return res.status(403).send({ msg: "Image cannot be empty." });

  const { filename, mimetype } = file;
  const ext = mimetype.split("/").reverse()[0];

  if (!checkImage(ext)) {
    fs.unlink(`${location}${filename}`, (err) => {
      if (err) console.log(err);
    });
    return res.status(403).send({ msg: "Invalid file type." });
  }

  next();
};

exports.isImagesValid = (location) => (req, res, next) => {
  const files = req.files;

  if (files.length === 0)
    return res.status(403).send({ msg: "Images cannot be empty." });

  const filesArr = files.filter((file) => {
    const { filename, mimetype } = file;
    const ext = mimetype.split("/").reverse()[0];

    if (!checkImage(ext)) {
      fs.unlink(`${location}${filename}`, (err) => {
        if (err) console.log(err);
      });
    } else {
      return file;
    }
  });

  req.filesArr = filesArr;
  next();
};

const checkImage = (ext) => {
  return ext === JPEG || ext === PNG || ext === JPG ? true : false;
};

exports.postsPagination = async (req, res, next) => {
  const limit = req.query.limit;
  const page = (req.query.page - 1) * limit;
  const { id } = req.userParams;

  const data = await Post.findAndCountAll({
    where: { userId: id },
    limit,
    offset: page,
  });

  res.posts = { data: data.rows, count: data.count };

  next();
};
