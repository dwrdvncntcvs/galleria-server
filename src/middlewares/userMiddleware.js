const { User } = require("../../models");
const { verify } = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../utils/constant");
const { isUuidValid } = require("../utils/validation");

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

  const user = req.currentUser ?? req.user;

  const isValid = await User.comparePassword(password, user.password);

  if (!isValid) return res.status(403).send({ msg: "Incorrect Password." });

  next();
};

exports.authenticate = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(403).send({ msg: "Sign in first." });

  const token = authorization.replace("Bearer ", "");
  verify(token, ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) return res.status(403).send({ msg: "Sign in first." });

    const { id, email } = payload;
    const user = await User.findOne({ where: { id, email } });
    req.user = user;
    next();
  });
};

exports.checkIfUsernameExist = async (req, res, next) => {
  const username = req.params.username;

  const user = await User.findUserByUsername(username);
  if (!user) return res.status(404).send({ msg: "User doesn't exist." });

  req.userParams = user;
  next();
};

exports.canEdit = async (req, res, next) => {
  const { userId } = req.params;
  const currentUser = req.user;

  if (!isUuidValid(userId))
    return res.status(404).send({ msg: "User not found." });

  const user = await User.findUserByUserId(userId);
  if (!user) return res.status(404).send({ msg: "User not found." });

  if (currentUser.id !== userId)
    return res
      .status(403)
      .send({ msg: "You have no permission to make changes." });

  next();
};

exports.checkUserId = (req, res, next) => {
  const id = req.query.id;

  if (id)
    if (!isUuidValid(id))
      return res.status(404).send({ msg: "User not found." });

  next();
};

exports.checkNewPassword = (req, res, next) => {
  const { newPassword } = req.body;

  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g.test(
      newPassword
    )
  )
    return res.status(403).send({
      msg: "Password must contain at least 8 letters in length, uppercase letters, lowercase letters, one number, and one symbol",
    });

  next();
};
