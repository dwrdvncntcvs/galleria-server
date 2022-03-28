const { TEXT, IMAGE, JPEG, JPG, PNG } = require("../utils/constant");
const fs = require("fs");

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

const checkImage = (ext) => {
  return ext === JPEG || ext === PNG || ext === JPG ? true : false;
};
