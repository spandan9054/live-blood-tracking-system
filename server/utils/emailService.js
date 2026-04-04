const nodemailer = require('nodemailer');

// Setup Ethereal or real SMTP transporter
const createTransporter = async () => {
    let transporter;
    if (process.env.NODE_ENV === 'development') {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            }
        });
    } else {
        transporter = nodemailer.createTransport({
            service: 'gmail', // or any other real SMTP service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return transporter;
};

const sendEmergencyEmail = async (emails, bloodGroup, message) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"SBAN Emergency Alert" <sban@example.com>',
            to: emails.join(', '),
            subject: `URGENT: ${bloodGroup} Blood Required!`,
            text: message,
            html: `<b>${message}</b>`
        });
        console.log("Emergency alert sent: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Email error: ", error);
    }
};

const sendDonationConfirmationEmail = async (toEmail, hospitalName) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"SBAN Notification" <sban@example.com>',
            to: toEmail,
            subject: `Donation Request Accepted`,
            text: `Your donation request has been accepted by ${hospitalName}. Thank you for your contribution.`,
            html: `Your donation request has been accepted by <b>${hospitalName}</b>. Thank you for your contribution.`
        });
        console.log("Confirmation email sent: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Email error: ", error);
    }
};

module.exports = { sendEmergencyEmail, sendDonationConfirmationEmail };
