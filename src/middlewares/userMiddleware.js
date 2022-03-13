const { User } = require("../../models");
const { verify } = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constant");

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

exports.authenticate = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(403).send({ msg: "Sign in first." });

  const token = authorization.replace("Bearer ", "");
  verify(token, SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).send({ msg: "Sign in first." });

    const { id, username } = payload;
    const user = await User.findOne({ where: { id, username } });
    req.user = user;
    next();
  });
};
