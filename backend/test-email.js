// Test SMTP connection
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testMail() {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        debug: true,
        logger: true,
    });

    try {
        console.log('\n--- Verifying transporter ---');
        await transporter.verify();
        console.log('✅ SMTP connection OK!');

        console.log('\n--- Sending test email ---');
        const info = await transporter.sendMail({
            from: `"WebCodeSoChill Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Test email from WebCodeSoChill',
            text: 'Mã xác nhận của bạn là: 123456',
        });
        console.log('✅ Email sent! MessageId:', info.messageId);
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error('Code:', err.code);
        console.error('Response:', err.response);
        console.error('ResponseCode:', err.responseCode);
    }
}

testMail();
