const { sequelize, Otp } = require("../../models");
const { sign } = require("jsonwebtoken");
const { OTP_TOKEN_SECRET } = require("../utils/constant");
const { generateOtp } = require("../services/otpService");

exports.createOTP = async (req, res) => {
  const user = req.user;

  const otp = generateOtp();

  const t = await sequelize.transaction();
  try {
    const otpToken = sign({ otp, userId: user.id }, OTP_TOKEN_SECRET, {
      expiresIn: "5mins",
    });

    const foundOtp = await Otp.findOtpTokenByUserId(user.id);
    if (!foundOtp)
      await Otp.createOtpToken({
        token: otpToken,
        userId: user.id,
        transaction: t,
      });
    else
      await Otp.updateExistingOtpToken({
        token: otpToken,
        userId: user.id,
        transaction: t,
      });
    await t.commit();

    return res.status(200).send({ msg: "OTP Created!", otpToken });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: err.message });
  }
};
