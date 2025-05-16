// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendEmail(to, subject, message) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: message
        });
        console.log("Email sent: " + info.response);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}

module.exports = sendEmail;
