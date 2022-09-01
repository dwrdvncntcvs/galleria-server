const { createTransport } = require("nodemailer");
const { google } = require("googleapis");
const { GOOGLE_CRED } = require("../utils/constant");
const { getTimePeriod } = require("../utils/helper");

class Mailer {
  transport;

  constructor() {
    console.table(GOOGLE_CRED);

    const OAuth2 = google.auth.OAuth2;

    const oAuth2Client = new OAuth2({
      clientId: GOOGLE_CRED.clientId,
      clientSecret: GOOGLE_CRED.clientSecret,
      redirectUri: GOOGLE_CRED.redirectUri,
    });

    oAuth2Client.setCredentials({ refresh_token: GOOGLE_CRED.refreshToken });

    const accessToken = oAuth2Client.getAccessToken();

    this.transport = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        accessToken,
        refreshToken: GOOGLE_CRED.refreshToken,
        clientId: GOOGLE_CRED.clientId,
        clientSecret: GOOGLE_CRED.clientSecret,
        user: GOOGLE_CRED.user,
        pass: GOOGLE_CRED.password,
      },
    });
  }
}

const sendOtpVerificationEmail = async (userData, otp) => {
  const { transport } = new Mailer();

  const timePeriod = getTimePeriod();

  return new Promise((resolve, reject) => {
    transport.sendMail(
      {
        from: GOOGLE_CRED.user,
        to: userData.email,
        subject: "EMAIL VERIFICATION",
        html: `
            Good ${timePeriod} ${userData.first_name}!
            <br>
            <br>
            This is the verification code for your account: <b>${otp}</b>.
            <br>
            This is only valid for <b>5 mins</b>.
            <br>
            <br>
            This is an automated message please do not reply.
            <br>
            <br>
    
            Galleria Team,
          `,
      },
      (err, payload) => {
        if (err) reject(err);

        resolve(payload);
      }
    );
  });
};

module.exports = { Mailer, sendOtpVerificationEmail };
