const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465, // Use 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.GOOGLE_PASS
  },
});

// const transporter = nodemailer.createTransport({
//   host: 'smtpout.secureserver.net',
//   port: 465, // Use 587 for TLS
//   secure: true, // true for 465, false for 587
//   auth: {
//     user: process.env.godaddyEmail,
//     pass: process.env.godaddyPassword
//   },
// });

// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to the email server:', error);
  } else {
    console.log('Server is ready to take messages:', success);
  }
});

const sendEmail = async (options) => {
 // console.log('sendEmail.js utils', options)

  const mailOptions = {
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });

};

module.exports = sendEmail;
