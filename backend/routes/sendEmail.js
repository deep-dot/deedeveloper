
const express = require('express');
const router = express.Router();
const ErrorHandler = require("../utils/errorhandler");
const sendEmail = require("../utils/sendEmail");

router.post('/verifyUserEmail', async (req, res) => {
    const { name, email, formId } = req.body;
    //console.log('req body in verifyUserEmail ==', req.body);
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;
    var message = `Hi ${name}, 
    Please verify your email by putting this ${verificationCode} code in deedeveloper.com website's prompted input field.
    Best wishes,
    deedeveloper.com`;

    if (formId === "contact-form-viewhome") {
        try {
            await sendEmail({
                email: email,
                subject: `Verify your email`,
                message: message
            });

            res.status(200).json({
                success: true,
                email,
                verificationCode
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Failed to send verification code',
              });
        }
    }
    if (formId === "contact-form-reactend") {
        try {
            await sendEmail({
                email: email,
                subject: `Verify your email`,
                message: message
            });

            res.status(200).json({
                success: true,
                email,
                verificationCode
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Failed to send verification code',
              });
        }
    }
});

router.post('/UserEmail', async (req, res) => {
    const { name, email, msg, formId } = req.body;
    //console.log('req body in useremail ==', req.body);
    var message = `Hi Dhillon, 
    You have got email from ${name}.
    ${msg}.`;

    if (formId === "contact-form-viewhome") {
        try {
            await sendEmail({
                email: process.env.SMTP_MAIL,
                subject: `Email from user`,
                message: message,
            });

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to send email',
              });
        }
    } else if (formId === "contact-form-reactend") {
        try {
            await sendEmail({
                email: process.env.SMTP_MAIL,
                subject: `Email from user`,
                message: message,
            });

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to send email',
              });
        }
    }
});

module.exports = router