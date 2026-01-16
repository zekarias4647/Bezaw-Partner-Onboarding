const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../connection/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { sendSupermarketId, sendManagerCredentials } = require('../utils/email');

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
    limits: {
        fieldSize: 25 * 1024 * 1024 // 25MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
        }
    }
});

// -------------------- ID Generator --------------------
function generateId(prefix) {
    const randomNum = Math.floor(Math.random() * 1000000); // 0 to 999999
    const sixDigit = String(randomNum).padStart(6, '0');   // e.g., 000001
    return `${prefix}-${sixDigit}`; // include dash
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// -------------------- Registration API --------------------
router.post('/register', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'vatCert', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    let { supermarket, branches, managers } = req.body;
    let managersToEmail = [];

    try {
        // Parse JSON strings if needed
        if (typeof supermarket === 'string') supermarket = JSON.parse(supermarket);
        if (typeof branches === 'string') branches = JSON.parse(branches);
        if (typeof managers === 'string') managers = JSON.parse(managers);

        if (!supermarket || !branches || !managers) {
            return res.status(400).json({ error: 'Missing required data' });
        }

        // Handle uploaded files
        if (req.files) {
            if (req.files['logo']) {
                supermarket.logo = `uploads/${req.files['logo'][0].originalname}`;
            }
            if (req.files['vatCert']) {
                supermarket.vatCert = `uploads/${req.files['vatCert'][0].originalname}`;
            }
            if (req.files['businessLicense']) {
                supermarket.businessLicense = `uploads/${req.files['businessLicense'][0].originalname}`;
            }
            if (req.files['image']) {
                supermarket.image = `uploads/${req.files['image'][0].originalname}`;
            }
        }

        // Start DB transaction
        await query('BEGIN');

        // 1. Insert Supermarket (ID matches RegCode from UI)
        await query(
            `INSERT INTO supermarkets (id, name, logo, vat_cert, business_license, tin, email, phone, website, image)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                supermarket.regCode,
                supermarket.name,
                supermarket.logo,
                supermarket.vatCert,
                supermarket.businessLicense,
                supermarket.tin,
                supermarket.email,
                supermarket.phone,
                supermarket.website,
                supermarket.image || null
            ]
        );

        const supermarketId = supermarket.regCode;



        // 3. Insert Branches (Generate IDs)
        const branchIdMap = new Map(); // Map UI-ID -> Server-ID
        if (branches && branches.length > 0) {
            for (const branch of branches) {
                const newBranchId = generateId('BZWB');

                await query(
                    `INSERT INTO branches (id, supermarket_id, name, address, map_pin, phone, is_busy)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [newBranchId, supermarketId, branch.name, branch.address, branch.coordinates, branch.phone, branch.isBusy]
                );

                branchIdMap.set(branch.id, newBranchId);
            }
        }

        // 4. Insert Managers (Generate IDs)
        if (managers && managers.length > 0) {
            for (const manager of managers) {
                const newManagerId = generateId('BZWM');
                const linkedBranchId = branchIdMap.get(manager.branchId) || null;

                if (!linkedBranchId && manager.branchId) {
                    console.warn(`Manager ${manager.name} linked to unknown branch ID ${manager.branchId}`);
                }

                const passwordToHash = manager.password || 'TempPass123!';
                const hashedPassword = await bcrypt.hash(passwordToHash, 10);

                managersToEmail.push({
                    email: manager.email,
                    name: manager.name,
                    password: passwordToHash,
                    branchId: linkedBranchId
                });

                await query(
                    `INSERT INTO managers (id, branch_id, name, email, phone, password_hash)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [newManagerId, linkedBranchId, manager.name, manager.email, manager.phone, hashedPassword]
                );
            }
        }

        await query('COMMIT');

        // Send Emails
        try {
            console.log(`Sending Welcome Email to Supermarket: ${supermarket.email}`);
            await sendSupermarketId(supermarket.email, supermarket.name, supermarketId);

            if (managersToEmail.length > 0) {
                console.log(`Sending emails to ${managersToEmail.length} managers...`);
                await Promise.all(managersToEmail.map(mgr =>
                    sendManagerCredentials(mgr.email, mgr.name, mgr.password, mgr.branchId)
                ));
            }
        } catch (emailErr) {
            console.error('Email sending warning:', emailErr);
            // We do not fail the request if email fails, but we log it.
        }

        res.status(201).json({ message: 'Registration successful', partnerId: supermarketId });

    } catch (err) {
        await query('ROLLBACK');
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again later.' });
    }
});



router.post('/login', async (req, res) => {
    const { regCode } = req.body;
    try {
        const result = await query('SELECT * FROM supermarkets WHERE id = $1', [regCode]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invalid Store ID Code' });
        }

        const supermarket = result.rows[0];
        // Generate JWT Token
        const token = jwt.sign(
            { id: supermarket.id, name: supermarket.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ success: true, token, supermarket });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get Branches for a Supermarket (Protected)
router.get('/:supermarketId/branches', authenticateToken, async (req, res) => {
    const { supermarketId } = req.params;

    // Security check: ensure the token owner matches the requested ID
    if (req.user.id !== supermarketId) {
        return res.status(403).json({ error: 'Unauthorized access to these branches' });
    }

    try {
        const result = await query('SELECT * FROM branches WHERE supermarket_id = $1', [supermarketId]);
        // Map database fields to frontend structure if necessary (e.g., map_pin -> coordinates)
        const branches = result.rows.map(b => ({
            id: b.id,
            name: b.name,
            address: b.address,
            coordinates: b.map_pin,
            phone: b.phone,
            isBusy: b.is_busy
        }));
        res.json(branches);
    } catch (err) {
        console.error('Error fetching branches:', err);
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
});

// Add a Single Branch (Protected)
router.post('/:supermarketId/branches', authenticateToken, async (req, res) => {
    const { supermarketId } = req.params;
    const { name, address, coordinates, phone } = req.body;

    // Security check
    if (req.user.id !== supermarketId) {
        return res.status(403).json({ error: 'Unauthorized action' });
    }

    if (!name || !address) {
        return res.status(400).json({ error: 'Name and address are required' });
    }

    try {
        const newBranchId = generateId('BZWB');

        await query(
            `INSERT INTO branches (id, supermarket_id, name, address, map_pin, phone, is_busy)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [newBranchId, supermarketId, name, address, coordinates || '', phone || '', false]
        );

        res.status(201).json({ success: true, message: 'Branch added successfully', branchId: newBranchId });
    } catch (err) {
        console.error('Error adding branch:', err);
        res.status(500).json({ error: 'Failed to add branch' });
    }
});

// Add a Single Manager (Protected)
router.post('/managers', authenticateToken, async (req, res) => {
    const { branchId, name, email, phone, password } = req.body;

    if (!branchId || !name || !email) {
        return res.status(400).json({ error: 'Branch ID, Name, and Email are required' });
    }

    try {
        const newManagerId = generateId('BZWM');
        const passwordToHash = password || 'TempPass123!';
        const hashedPassword = await bcrypt.hash(passwordToHash, 10);

        await query(
            `INSERT INTO managers (id, branch_id, name, email, phone, password_hash)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [newManagerId, branchId, name, email, phone || '', hashedPassword]
        );

        // Send Manager Email
        sendManagerCredentials(email, name, passwordToHash, branchId);

        res.status(201).json({ success: true, message: 'Manager added successfully', managerId: newManagerId });
    } catch (err) {
        console.error('Error adding manager:', err);
        res.status(500).json({ error: 'Failed to add manager' });
    }
});

// Get Managers for a Branch (Protected)
router.get('/branches/:branchId/managers', authenticateToken, async (req, res) => {
    const { branchId } = req.params;
    const supermarketId = req.user.id; // From JWT

    try {
        // verify branch ownership
        const branchCheck = await query('SELECT 1 FROM branches WHERE id = $1 AND supermarket_id = $2', [branchId, supermarketId]);
        if (branchCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized access to this branch' });
        }

        const result = await query('SELECT * FROM managers WHERE branch_id = $1', [branchId]);
        const managers = result.rows.map(m => ({
            id: m.id,
            branchId: m.branch_id,
            name: m.name,
            email: m.email,
            phone: m.phone
        }));
        res.json(managers);
    } catch (err) {
        console.error('Error fetching managers:', err);
        res.status(500).json({ error: 'Failed to fetch managers' });
    }
});

// Delete Manager (Protected)
router.delete('/managers/:managerId', authenticateToken, async (req, res) => {
    const { managerId } = req.params;
    const supermarketId = req.user.id;

    try {
        // Verify ownership
        const ownershipCheck = await query(
            `SELECT 1 FROM managers m 
             JOIN branches b ON m.branch_id = b.id 
             WHERE m.id = $1 AND b.supermarket_id = $2`,
            [managerId, supermarketId]
        );

        if (ownershipCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized access to this manager' });
        }

        await query('DELETE FROM managers WHERE id = $1', [managerId]);
        res.json({ success: true, message: 'Manager deleted successfully' });
    } catch (err) {
        console.error('Error deleting manager:', err);
        res.status(500).json({ error: 'Failed to delete manager' });
    }
});





module.exports = router;
