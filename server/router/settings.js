const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../connection/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Update Vendor Info
router.put('/vendor', authenticateToken, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'vatCert', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    const vendorId = req.user.id;
    let { name, email, phone, website, tin, businessType } = req.body;

    try {
        const updateFields = [];
        const values = [];
        let counter = 1;

        if (name) { updateFields.push(`name = $${counter++}`); values.push(name); }
        if (email) { updateFields.push(`email = $${counter++}`); values.push(email); }
        if (phone) { updateFields.push(`phone = $${counter++}`); values.push(phone); }
        if (website) { updateFields.push(`website = $${counter++}`); values.push(website); }
        if (tin) { updateFields.push(`tin = $${counter++}`); values.push(tin); }
        if (businessType) { updateFields.push(`business_type = $${counter++}`); values.push(businessType.toLowerCase()); }

        if (req.files) {
            if (req.files['logo']) {
                const logoPath = `uploads/${req.files['logo'][0].originalname}`;
                updateFields.push(`logo = $${counter++}`);
                values.push(logoPath);
            }
            if (req.files['vatCert']) {
                const vatCertPath = `uploads/${req.files['vatCert'][0].originalname}`;
                updateFields.push(`vat_cert = $${counter++}`);
                values.push(vatCertPath);
            }
            if (req.files['businessLicense']) {
                const licensePath = `uploads/${req.files['businessLicense'][0].originalname}`;
                updateFields.push(`business_license = $${counter++}`);
                values.push(licensePath);
            }
            if (req.files['image']) {
                const imagePath = `uploads/${req.files['image'][0].originalname}`;
                updateFields.push(`image = $${counter++}`);
                values.push(imagePath);
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(vendorId);
        const updateQuery = `UPDATE vendors SET ${updateFields.join(', ')} WHERE id = $${counter} RETURNING *`;

        const result = await query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully', vendor: result.rows[0] });

    } catch (err) {
        console.error('Error updating vendor:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
