const { sequelize, User } = require("../../models");

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
    const errorMessage =
      typeof err.message === "string"
        ? err.message.split(": ")[1].split(",\n")
        : err.message;  
    await t.rollback();

    return res.status(errorMessage[0]).send({ msg: errorMessage[1] });
  }
};
