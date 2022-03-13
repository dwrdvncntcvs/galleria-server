const { User } = require("../../models");

exports.checkIfEmailExists = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findUserByEmail(email);
  if (!user)
    return res.status(403).send({ msg: "Email or password incorrect." });

  req.currentUser = user;
  next();
};

exports.validatePassword = async (req, res, next) => {
  const { password } = req.body;

  const user = req.currentUser;
  const isValid = await User.comparePassword(password, user.password);

  if (!isValid)
    return res.status(403).send({ msg: "Email or password incorrect." });

  next();
};
