const { User } = require("../../models");

exports.checkIfEmailExists = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findUserByEmail(email);
  if (user) return res.status(403).send({ msg: "Email already exist." });

  next();
};

exports.checkIfUsernameExist = async (req, res, next) => {
  const { username } = req.body;

  const user = await User.findUserByUsername(username);
  if (user) return res.status(403).send({ msg: "Username already exist." });

  next();
};
