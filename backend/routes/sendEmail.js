const express = require('express');
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

async function handleEmailSending(req, res, subject, message, email) {
    try {
        await sendEmail({
            email,
            subject,
            message
        });
        res.status(200).json({
            success: true,
            email,
            ...(subject.includes('Verify') && { verificationCode: req.body.verificationCode }), // Include verificationCode in the response only if it's a verification email
            message: 'Verification code sent to email, please verify.'
        });
    } catch (error) {
        console.error(error);
        let responseMessage = 'Failed to send email. Please try again later.';
        if (error.message.includes('invalid_grant')) {
            responseMessage = 'Email service is currently unavailable. Please try again later.';
        }
        res.status(500).json({
            success: false,
            message: responseMessage,
        });
    }
}

const verificationCodes = {};

router.post('/verifyUserEmail', async (req, res) => {
    console.log('verifyuserEmail==', req.body);
    const { name, formId, email } = req.body;
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;
    const message = `Hi ${name}, \nPlease verify your email by putting this ${verificationCode} code in deedeveloper.com website's prompted input field.\nBest wishes,\ndeedeveloper.com`;
    if (["contact-form-viewhome", "contact-form-reactend"].includes(formId)) {
        verificationCodes[email.toLowerCase().trim()] = verificationCode;
        await handleEmailSending(req, res, `Verify your email`, message, email);
    }
});

router.post('/UserEmail', async (req, res) => {
    //console.log('req.body===', req.body);
    const { name, email, verificationCode, message, formId } = req.body;
    const msg = `Hi Deedeveloper, \nYou have got email from ${name}\n${email}.\n${message}.`;
    if (["contact-form-viewhome", "contact-form-reactend"].includes(formId)) {
        if (verificationCode == '' || verificationCode == null || verificationCode == undefined) {
            await handleEmailSending(req, res, `Email from user`, msg, process.env.SMTP_MAIL);
           // await handleEmailSending(req, res, `Email from user`, msg, process.env.godaddyEmail);
            // return res.json({ success: true, message: 'Email sent successfully.' });
        } else {
            const storedCode = verificationCodes[email.toLowerCase().trim()];
            // console.log('Comparing:', verificationCode, storedCode, 'Types:', typeof verificationCode, typeof storedCode);
            if (verificationCode && String(verificationCode) === String(storedCode)) {
                //console.log('req.body===', verificationCode, storedCode);
                await handleEmailSending(req, res, `Email from user`, msg, process.env.SMTP_MAIL);
                // await handleEmailSending(req, res, `Email from user`, msg, process.env.godaddyEmail);
                delete verificationCodes[email.toLowerCase().trim()];
            } else {
                //console.log('req.body===errr==', verificationCode, storedCode);
                return res.status(401).json({ success: false, message: 'Invalid verification code' });
            }
        }
    } else {
        return res.status(400).json({ success: false, message: 'Invalid formId' });
    }
});

module.exports = router;
