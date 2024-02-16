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
            ...(subject.includes('Verify') && { verificationCode: req.body.verificationCode }) // Include verificationCode in the response only if it's a verification email
        });
    } catch (error) {
        console.error(error); 
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
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
    //console.log('req.body===', req.body)
    const { name, email, verificationCode, message, formId } = req.body;
    const msg = `Hi Deedeveloper, \nYou have got email from ${name}\n${email}.\n${message}.`;

    if (["contact-form-viewhome", "contact-form-reactend"].includes(formId)) {
        const storedCode = verificationCodes[email.toLowerCase().trim()];
        //console.log('stored code===', storedCode, verificationCode)
        if (verificationCode && verificationCode == storedCode) {            
            await handleEmailSending(req, res, `Email from user`, msg, process.env.godaddyEmail);
            delete verificationCodes[email.toLowerCase().trim()];
        } else {
            res.status(401).json({ success: false, message: 'Invalid verification code' });
        }
    }
});


module.exports = router;
