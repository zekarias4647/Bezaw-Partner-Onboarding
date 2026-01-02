const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('Email transporter verification failed:', error);
    } else {
        console.log('Email server is ready to take our messages');
    }
});

/**
 * Sends the Supermarket ID to the registered email.
 * @param {string} email - Recipient email
 * @param {string} name - Supermarket Name
 * @param {string} id - Supermarket ID (RegCode)
 */
const sendSupermarketId = async (email, name, id) => {
    try {
        const mailOptions = {
            from: 'Bezaw<' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'Welcome to Bezaw - Your Store ID',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Bezaw</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center;">
                            <div style="width: 80px; height: 80px; background-color: white; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 7H17C18.1046 7 19 7.89543 19 9V15C19 16.1046 18.1046 17 17 17H7C5.89543 17 5 16.1046 5 15V9C5 7.89543 5.89543 7 7 7Z" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M5 10H19" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0;">Welcome to Bezaw</h1>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Hello, ${name}!</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">Thank you for registering with Bezaw. We're excited to have you on board!</p>
                            
                            <!-- Store ID Card -->
                            <div style="background-color: #f3f4f6; border-radius: 10px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #6366f1;">
                                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Store ID Code</p>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <p style="color: #1f2937; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 1px;">${id}</p>
                                    <div style="background-color: #6366f1; color: white; font-size: 14px; padding: 6px 12px; border-radius: 20px; font-weight: 600;">IMPORTANT</div>
                                </div>
                            </div>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Please keep this ID safe as you will need it to login to your account. We recommend saving it in a secure location.</p>
                            
                            <!-- Action Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; font-size: 16px; font-weight: 600; padding: 12px 30px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);">Get Started</a>
                            </div>
                            
                            <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">If you have any questions or need assistance, please don't hesitate to contact our support team at support@bezaw.com</p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 14px; margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bezaw. All rights reserved.</p>
                            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                                <a href="#" style="color: #6b7280; text-decoration: none;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" style="color: #6b7280; text-decoration: none;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" style="color: #6b7280; text-decoration: none;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Supermarket ID email sent:', info.response);
        return { success: true };
    } catch (error) {
        console.error('Error sending Supermarket ID email:', error);
        // We don't throw here to avoid failing the request if email fails, 
        // but arguably we could return false.
        return { success: false, error };
    }
};

/**
 * Sends login credentials to a new Manager.
 * @param {string} email - Manager's email
 * @param {string} name - Manager's Name
 * @param {string} password - Manager's Password
 * @param {string} branchId - The Branch ID they are assigned to
 */
const sendManagerCredentials = async (email, name, password, branchId) => {
    try {
        const mailOptions = {
            from: 'Bezaw<' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'Your Bezaw Manager Account',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your Bezaw Manager Account</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center;">
                            <div style="width: 80px; height: 80px; background-color: white; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0;">Manager Account Created</h1>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Hello ${name},</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">You have been added as a manager for Branch ID: <span style="font-weight: 600; color: #10b981;">${branchId || 'N/A'}</span>.</p>
                            
                            <!-- Credentials Card -->
                            <div style="background-color: #f0fdf4; border-radius: 10px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #10b981;">
                                <p style="color: #059669; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Your Login Credentials</p>
                                
                                <div style="background-color: white; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <div style="width: 40px; height: 40px; background-color: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M22 6L12 13L2 6" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">Email</p>
                                            <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0;">${email}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                                    <div style="display: flex; align-items: center;">
                                        <div style="width: 40px; height: 40px; background-color: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <circle cx="12" cy="16" r="1" fill="#10b981"/>
                                                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p style="color: #6b7280; font-size: 12px; margin: 0 0 5px 0;">Password</p>
                                            <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0;">${password}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; margin-bottom: 30px; display: flex; align-items: center;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; flex-shrink: 0;">
                                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p style="color: #92400e; font-size: 14px; margin: 0;">Please change your password after your first login for security reasons.</p>
                            </div>
                            
                            <!-- Action Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-size: 16px; font-weight: 600; padding: 12px 30px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">Login to Your Account</a>
                            </div>
                            
                            <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">If you have any questions or need assistance, please don't hesitate to contact our support team at support@bezaw.com</p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 14px; margin: 0 0 10px 0;">© ${new Date().getFullYear()} Bezaw. All rights reserved.</p>
                            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;">
                                <a href="#" style="color: #6b7280; text-decoration: none;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" style="color: #6b7280; text-decoration: none;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" style="color: #6b7280; text-decoration: none;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Manager credentials email sent:', info.response);
        return { success: true };
    } catch (error) {
        console.error('Error sending Manager credentials email:', error);
        return { success: false, error };
    }
};

module.exports = {
    sendSupermarketId,
    sendManagerCredentials
};