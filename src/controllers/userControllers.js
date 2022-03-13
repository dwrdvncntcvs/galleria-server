const { sequelize, User, Profile } = require("../../models");
const { errorMessage } = require("../utils/error");
const { sign } = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constant");

exports.createNewUser = async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;

  const t = await sequelize.transaction();
  try {
    const user = await User.create(
      { first_name, last_name, username, email, password },
      { transaction: t }
    );

    await Profile.create({ userId: user.id }, { transaction: t });
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

exports.userProfile = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ where: { username } });
    const profile = {
      user,
      profile: await Profile.findOne({ where: { userId: user.id } }),
    };

    return res.send({ profile });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong." });
  }
};
