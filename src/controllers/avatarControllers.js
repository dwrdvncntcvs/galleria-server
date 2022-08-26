const { sequelize, Avatar } = require("../../models");
const { errorMessage } = require("../utils/error");

exports.uploadAvatar = async (req, res) => {
  const { filename, path, mimetype, size } = req.file;
  const { id } = req.user;

  const t = await sequelize.transaction();
  try {
    await Avatar.update(
      { filename, path, mimetype, size },
      { where: { userId: id } },
      { transaction: t }
    );
    await t.commit();

    return res.status(200).send({ msg: "Avatar Uploaded." });
  } catch (err) {
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.removeAvatar = async (req, res) => {
  const { id } = req.user;

  const t = await sequelize.transaction();
  try {
    await Avatar.update(
      { filename: "", path: "", mimetype: "", size: "" },
      { where: { userId: id } },
      { transaction: t }
    );
    await t.commit();

    return res.status(200).send({ msg: "Avatar Deleted." });
  } catch (err) {
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};
