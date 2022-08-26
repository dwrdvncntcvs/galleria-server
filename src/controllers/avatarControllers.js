const { sequelize, Avatar, Profile } = require("../../models");
const { uploadFileToFS } = require("../services/firebaseService");
const { errorMessage } = require("../utils/error");

exports.uploadAvatar = async (req, res) => {
  const file = req.file;
  const { id } = req.user;
  file["userId"] = id;

  const t = await sequelize.transaction();
  try {
    const imageUrl = await uploadFileToFS({ file });
    await Profile.updateProfileImage({ profileImage: imageUrl, userId: id }, t);
    await t.commit();

    return res.status(200).send({ msg: "Avatar Uploaded." });
  } catch (err) {
    console.log(err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.removeAvatar = async (req, res) => {
  const { id } = req.user;

  const t = await sequelize.transaction();
  try {
    console.log("ID: ", id);
    await Profile.removeProfileImage({ userId: id, transaction: t });

    // await Avatar.update(
    //   { filename: "", path: "", mimetype: "", size: "" },
    //   { where: { userId: id } },
    //   { transaction: t }
    // );
    await t.commit();

    return res.status(200).send({ msg: "Avatar Deleted." });
  } catch (err) {
    console.log("ERROR: ", err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};
