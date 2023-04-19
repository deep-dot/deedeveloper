
const express = require('express');
const router = express.Router();
const ErrorHandler = require("../utils/errorhandler");
const sendEmail = require("../utils/sendEmail");

router.post('/verifyUserEmail', async (req, res) => {
   // console.log('response====', req.body);
    const { name, email, verificationCode } = req.body;
    var message = `Hi ${name}, 
    Please verify your email by putting this ${req.body.verificationCode} code in deedeveloper website's prompted input field.
    Best wishes,
    deedeveloper.com`;

    try {
        await sendEmail({
            email: req.body.email,
            subject: `Verify your email`,
            message: message,
        });

        res.status(200).json({
            success: true,
            email
        });
    } catch (error) {
        console.log(error);
        //return next(new ErrorHandler(error.message, 500));
    }
});

router.post('/UserEmail', async (req, res) => {
    //console.log('response email', req.body);
    const name = req.body.name,
        email = req.body.email,
        msg = req.body.message;
    var message = `Hi Dhillon, 
    You have got email from ${name}.
    ${msg}.`;

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
});

module.exports = router