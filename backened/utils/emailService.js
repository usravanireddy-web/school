const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendWelcomeEmail = async (email, name, userId, password, role) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Welcome to School Management System - ${role.charAt(0).toUpperCase() + role.slice(1)} Account`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Welcome to School Management System!</h2>
                    <p>Dear ${name},</p>
                    <p>Your ${role} account has been created successfully.</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>User ID:</strong> ${userId}</p>
                        <p><strong>Password:</strong> ${password}</p>
                        <p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
                    </div>
                    <p>Please login to the system and change your password immediately.</p>
                    <p>Best regards,<br>School Management Team</p>
                </div>
            `
        };

        if (process.env.EMAIL_SERVICE && process.env.EMAIL_SERVICE !== 'false') {
            await transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${email}`);
        } else {
            console.log('Email service disabled. Would have sent:', mailOptions);
        }
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - School Management System',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Password Reset Request</h2>
                    <p>Dear ${name},</p>
                    <p>You have requested to reset your password. Click the link below to reset your password:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>School Management Team</p>
                </div>
            `
        };

        if (process.env.EMAIL_SERVICE && process.env.EMAIL_SERVICE !== 'false') {
            await transporter.sendMail(mailOptions);
        } else {
            console.log('Email service disabled. Would have sent password reset email to:', email);
        }
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};