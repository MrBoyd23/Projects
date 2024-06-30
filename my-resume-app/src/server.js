const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 5000; // Your backend server port

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST route to handle form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message, inquiryType } = req.body;

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.brandonaboyd.com', // Update with your SMTP server details
        port: 465,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'flossmore@brandonaboyd.com', // Your email address
            pass: 'NmjZ-opV0u%#', // Your password
        },
    });

    // Setup email data with unicode symbols
    let mailOptions = {
        from: '"Contact Form" <noreply@example.com>', // sender address
        to: 'flossmore@brandonaboyd.com', // list of receivers (recipient email address)
        subject: `New ${inquiryType} Inquiry from ${name}`, // Subject line
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`, // plain text body
    };

    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

