const { sequelize, User } = require("../../models");
const { errorMessage } = require("../utils/error");

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
    const error = errorMessage(err);
    await t.rollback();
    return res.status(error[0]).send({ msg: error[1] });
  }
};
