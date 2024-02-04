const express = require('express');
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

async function handleEmailSending(req, res, subject, message) {
    try {
        await sendEmail({
            email: req.body.email,
            subject,
            message
        });
        res.status(200).json({
            success: true,
            email: req.body.email,
            ...(subject.includes('Verify') && { verificationCode: req.body.verificationCode }) // Include verificationCode in the response only if it's a verification email
        });
    } catch (error) {
        console.error(error); // Consider a more robust logging solution
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
        });
    }
}

router.post('/verifyUserEmail', async (req, res) => {
    const { name, formId } = req.body;
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;
    const message = `Hi ${name}, \nPlease verify your email by putting this ${verificationCode} code in deedeveloper.com website's prompted input field.\nBest wishes,\ndeedeveloper.com`;
    if (["contact-form-viewhome", "contact-form-reactend"].includes(formId)) {
        await handleEmailSending(req, res, `Verify your email`, message);
    }
});

router.post('/UserEmail', async (req, res) => {
    const { name, msg, formId } = req.body;
    const message = `Hi Dhillon, \nYou have got email from ${name}.\n${msg}.`;

    if (["contact-form-viewhome", "contact-form-reactend"].includes(formId)) {
        await handleEmailSending(req, res, `Email from user`, message);
    }
});

module.exports = router;
