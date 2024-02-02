const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
   //secure: false,
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      //pass: process.env.MAIL_PASSWORD,
      // user: process.env.SMTP_MAIL,
      // pass: process.env.SMTP_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: `1//04cY3d8aJrTYeCgYIARAAGAQSNwF-L9IriB9gc2Yo608BdQap3kC9tugbb9IyHsWd_vw5p43DvfXYbmL8fKKt75IfbzU5FcZSzhY`,
      //access_token: 'ya29.a0AfB_byAGeZifxFNiMsrKGN6U-4wt2YrLw_slK1VT7wJREdzFa6qaNZYheXUgn7GJSh__61kCOOd7qeKzwUtKw-gYKzlXPgGx_RSJSR3VPob1NIf36dUzR5ht9Wxpddf2b3T1vZLpxrLq5mXnX0C1Fj5CFPNkTspTaFQPaCgYKAVwSARESFQHGX2MiV6EwtUm9VDAvbUchZma35w0171'
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log('error verify transporter', error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  
//console.log('options in `utils sendemail.js`===', transporter);
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: options.email,    
    subject: options.subject,    
    text: options.message,
    html: options.html,
  };
 // console.log('options in `utils sendemail.js`===', transporter);
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    //console.error('Error sending email:', error);
  }  
};

module.exports = sendEmail;
