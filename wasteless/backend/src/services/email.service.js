import nodemailer from 'nodemailer';
import { emailConfig } from '../config/index.js';

let transporter;

// Create transporter
if (emailConfig.auth.user && emailConfig.auth.pass) {
    transporter = nodemailer.createTransporter(emailConfig);
} else {
    // Mock transporter for development
    console.log('⚠️  Email service running in MOCK mode');
    transporter = {
        sendMail: async (options) => {
            console.log('📧 Mock Email Sent:');
            console.log('To:', options.to);
            console.log('Subject:', options.subject);
            console.log('Body:', options.text || options.html);
            return { messageId: 'mock-' + Date.now() };
        },
    };
}

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: emailConfig.from,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Email error:', error);
        throw error;
    }
};
