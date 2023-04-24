
const express = require('express');
const router = express.Router();
const ErrorHandler = require("../utils/errorhandler");
const sendEmail = require("../utils/sendEmail");

router.post('/verifyUserEmail', async (req, res) => {
    const { name, email, formId } = req.body;
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;
    var message = `Hi ${name}, 
    Please verify your email by putting this ${verificationCode} code in deedeveloper website's prompted input field.
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
        }
    } else if (formId === "contact-form-reactend") {
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
        }
    }
});

router.post('/UserEmail', async (req, res) => {
    //console.log('response email', req.body);
    const { name, email, msg, formId } = req.body;
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
            return next(new ErrorHandler(error.message, 500));
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
            return next(new ErrorHandler(error.message, 500));
        }
    }
});

module.exports = router