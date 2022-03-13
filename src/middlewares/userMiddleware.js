const { User } = require("../../models");

exports.checkIfEmailExists = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findUserByEmail(email);
  if (!user) return res.status(403).send({ msg: "Email doesn't exist." });

  next();
};
