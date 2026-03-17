/**
 * server/server.js — Express backend for the contact form
 *
 * Run with: node server/server.js  (or: npm run server from the project root)
 *
 * Requires a .env file at the project root with:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECIPIENT
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express    = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app  = express();
const port = process.env.SERVER_PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST /api/contact — handles the contact form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message, inquiryType } = req.body;

    const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from:    `"Contact Form" <${process.env.SMTP_USER}>`,
        to:      process.env.CONTACT_RECIPIENT,
        subject: `New ${inquiryType} Inquiry from ${name}`,
        text:    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent:', info.messageId);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
