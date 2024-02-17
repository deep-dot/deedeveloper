const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require('../config/config.js');
const env = process.env.NODE_ENV || 'development';

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_URL
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
  });
    const accessToken = await oauth2Client.getAccessToken();
    const token = accessToken.token;
   console.log('Access Token:', process.env.godaddyEmail, process.env.godaddyPassword);
  
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_MAIL,
      accessToken: token,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    },
  });

// const transporter = nodeMailer.createTransport({    
//     host: "smtpout.secureserver.net",  
//     secure: true,
//     secureConnection: false, // TLS requires secureConnection to be false
//     tls: {
//         ciphers:'SSLv3'
//     },
//     requireTLS:true,
//     port: 465,
//     debug: true,
//     auth: {
//         user: process.env.godaddyEmail,
//         pass: process.env.godaddyPassword
//     }
// });

  return transporter;
};

const sendEmail = async (options) => {  
  try {
    const transporter = await createTransporter(); 

    const mailOptions = {
      // from: process.env.godaddyEmail,
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    console.log('Preparing to send email:', mailOptions);
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;