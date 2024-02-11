const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require('../config/config.js');
const env = process.env.NODE_ENV || 'development';

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
  });
  //console.log('accesstoken===', process.env.OAUTH_REFRESH_TOKEN);
  try {
    const accessToken = await oauth2Client.getAccessToken();
    console.log('Access Token:', accessToken.token);
  } catch (error) {
    console.error('Error getting access token:');
  }
  

  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      // accessToken: accessToken.token,
      accessToken: process.env.OAUTH_ACCESS_TOKEN,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    },
  });

  return transporter;
};

const sendEmail = async (options) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:');
  }
};

module.exports = sendEmail;
