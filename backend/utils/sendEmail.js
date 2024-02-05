const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    //service: process.env.SMTP_SERVICE,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: process.env.OAUTH_ACCESS_TOKEN,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      },
  });
  
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: options.email,    
    subject: options.subject,    
    text: options.message,
  };

  //console.log('options in `utils sendemail.js`===', mailOptions);
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }  
 };

module.exports = sendEmail;
