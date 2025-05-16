// controllers/messagesController.js
const sendEmail = require('../config/email');

/**
 * Send a simple email
 */
exports.sendSimpleEmail = async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailSent = await sendEmail(to, subject, message);

        if (emailSent) {
            res.status(200).json({ message: "Email sent successfully" });
        } else {
            res.status(500).json({ error: "Failed to send email" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
