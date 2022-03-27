const { sequelize, Post } = require("../../models");
const { errorMessage } = require("../utils/error");

exports.createTextPost = async (req, res) => {
  const { content } = req.body;
  const user = req.user;

  const t = await sequelize.transaction();
  try {
    await Post.create({ content, userId: user.id }, { transaction: t });
    await t.commit();

    return res.status(200).send({ msg: "Posted." });
  } catch (err) {
    console.log("Error: ", err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};
