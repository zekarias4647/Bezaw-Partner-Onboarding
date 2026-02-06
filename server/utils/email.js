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
 * Sends the Store ID to the registered email.
 * @param {string} email - Recipient email
 * @param {string} name - Vendor Name
 * @param {string} id - Vendor ID (RegCode)
 */
const sendStoreId = async (email, name, id) => {
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
                <body style="margin: 0; padding: 0; font-family: 'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f1f5f9;">
                    <div style="max-width: 600px; margin: 40px auto; background-color: #1e293b; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid #334155;">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center;">
                            <div style="width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                            <h1 style="color: white; font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Welcome Partner</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-top: 10px; font-weight: 500;">Let's get your store online</p>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 32px;">
                            <p style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Registration Complete</p>
                            <h2 style="color: #f8fafc; font-size: 24px; margin: 0 0 24px 0; font-weight: 700;">Hello, ${name}</h2>
                            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Your application has been processed successfully. You are now part of the Bezaw Drive-Through Network.</p>
                            
                            <!-- Store ID Card -->
                            <div style="background-color: #0f172a; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #334155; position: relative;">
                                <div style="position: absolute; top: -1px; left: 24px; right: 24px; height: 1px; background: linear-gradient(90deg, transparent, #10b981, transparent);"></div>
                                <p style="color: #64748b; font-size: 11px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Your Unique Store ID</p>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <p style="color: #10b981; font-size: 32px; font-weight: 700; margin: 0; font-family: monospace; letter-spacing: 2px;">${id}</p>
                                    <div style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 12px; padding: 4px 12px; border-radius: 999px; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.2);">ACTIVE</div>
                                </div>
                            </div>
                            
                            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0;">Use this ID to access your dashboard. It identifies your brand across our entire logistics network.</p>
                            
                            <!-- Action Button -->
                            <div style="text-align: center; margin-bottom: 10px;">
                                <a href="#" style="display: inline-block; background-color: #10b981; color: #064e3b; font-size: 16px; font-weight: 700; padding: 16px 32px; text-decoration: none; border-radius: 12px; transition: all 0.2s;">Access Partner Portal</a>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-top: 1px solid #334155;">
                            <p style="color: #475569; font-size: 12px; margin: 0 0 8px 0; font-weight: 500;">&copy; ${new Date().getFullYear()} Bezaw. All rights reserved.</p>
                            <p style="color: #475569; font-size: 12px; margin: 0;">Addis Ababa, Ethiopia</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Vendor ID email sent:', info.response);
        return { success: true };
    } catch (error) {
        console.error('Error sending Vendor ID email:', error);
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
            subject: 'Your Bezaw Manager Access',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Manager Access Granted</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f1f5f9;">
                    <div style="max-width: 600px; margin: 40px auto; background-color: #1e293b; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid #334155;">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 40px 20px; text-align: center; border-bottom: 1px solid #334155;">
                            <div style="width: 64px; height: 64px; background-color: rgba(16, 185, 129, 0.1); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(16, 185, 129, 0.2);">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <h1 style="color: white; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Manager Assigned</h1>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 32px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                                <div style="height: 1px; flex: 1; background-color: #334155;"></div>
                                <span style="color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Access Details</span>
                                <div style="height: 1px; flex: 1; background-color: #334155;"></div>
                            </div>

                            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; text-align: center;">
                                Hello <strong style="color: white;">${name}</strong>,<br>
                                You have been granted operational access to Branch <span style="color: #10b981; font-family: monospace;">${branchId || 'N/A'}</span>.
                            </p>
                            
                            <!-- Credentials Card -->
                            <div style="background-color: #0f172a; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #334155;">
                                <div style="margin-bottom: 20px;">
                                    <p style="color: #64748b; font-size: 11px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Email Address</p>
                                    <p style="color: #f8fafc; font-size: 16px; margin: 0;">${email}</p>
                                </div>
                                <div>
                                    <p style="color: #64748b; font-size: 11px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Temporary Password</p>
                                    <div style="background-color: #1e293b; padding: 12px 16px; border-radius: 8px; display: inline-block; border: 1px dashed #475569;">
                                        <p style="color: #10b981; font-size: 18px; margin: 0; font-family: monospace; font-weight: 700; letter-spacing: 1px;">${password}</p>
                                    </div>
                                </div>
                            </div>

                            <div style="background-color: rgba(245, 158, 11, 0.1); border-radius: 12px; padding: 16px; display: flex; gap: 12px; border: 1px solid rgba(245, 158, 11, 0.2);">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                                <p style="color: #fbbf24; font-size: 13px; line-height: 1.5; margin: 0;">Security Alert: Change this password immediately upon first login.</p>
                            </div>
                            
                            <!-- Action Button -->
                            <div style="text-align: center; margin-top: 32px;">
                                <a href="#" style="display: inline-block; background-color: white; color: #0f172a; font-size: 15px; font-weight: 700; padding: 14px 28px; text-decoration: none; border-radius: 12px; transition: all 0.2s;">Login to Dashboard</a>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-top: 1px solid #334155;">
                            <p style="color: #475569; font-size: 12px; margin: 0;">Bezaw Manager Portal &bull; Secure System</p>
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
    sendStoreId,
    sendManagerCredentials
};