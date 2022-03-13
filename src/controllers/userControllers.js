const { sequelize, User } = require("../../models");
const { errorMessage } = require("../utils/error");
const { sign } = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constant");

exports.createNewUser = async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;

  const t = await sequelize.transaction();
  try {
    await User.create(
      { first_name, last_name, username, email, password },
      { transaction: t }
    );
    await t.commit();

    return res.status(200).send({ msg: "Account created.", user: req.body });
  } catch (err) {
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.signIn = (req, res) => {
  const { id, username } = req.currentUser;

  const payload = { id, username };
  const token = sign(payload, SECRET_KEY);

  return res.status(200).send({ token });
};
