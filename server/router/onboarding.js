const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../connection/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { sendStoreId, sendManagerCredentials } = require('../utils/email');

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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
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
    const crypto = require('crypto');
    const randomNum = crypto.randomInt(100000, 999999); 
    return `${prefix}-${randomNum}`;
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

// -------------------- Business Types API --------------------
router.get('/business-types', async (req, res) => {
    try {
        const result = await query('SELECT * FROM business_types ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching business types:', err);
        res.status(500).json({ error: 'Failed to fetch business types' });
    }
});

// -------------------- Registration API --------------------
router.post('/register', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'vatCert', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    let { vendor, branches, managers } = req.body;
    let managersToEmail = [];

    try {
        // Parse JSON strings if needed
        if (typeof vendor === 'string') vendor = JSON.parse(vendor);
        if (typeof branches === 'string') branches = JSON.parse(branches);
        if (typeof managers === 'string') managers = JSON.parse(managers);

        if (!vendor || !branches || !managers) {
            return res.status(400).json({ error: 'Missing required data' });
        }

        // Handle uploaded files
        if (req.files) {
            if (req.files['logo']) {
                vendor.logo = `uploads/${req.files['logo'][0].filename}`;
            }
            if (req.files['vatCert']) {
                vendor.vatCert = `uploads/${req.files['vatCert'][0].filename}`;
            }
            if (req.files['businessLicense']) {
                vendor.businessLicense = `uploads/${req.files['businessLicense'][0].filename}`;
            }
            if (req.files['image']) {
                vendor.image = `uploads/${req.files['image'][0].filename}`;
            }
        }

        // Check if TIN already exists
        const tinCheck = await query('SELECT id FROM vendors WHERE tin = $1', [vendor.tin]);
        if (tinCheck.rows.length > 0) {
            return res.status(400).json({ error: 'This Business TIN is already registered.' });
        }

        // Start DB transaction
        await query('BEGIN');

        // 1. Insert Supermarket (ID matches RegCode from UI)
        await query(
            `INSERT INTO vendors (id, name, logo, vat_cert, business_license, tin, email, phone, website, image, business_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                vendor.regCode,
                vendor.name,
                vendor.logo,
                vendor.vatCert,
                vendor.businessLicense,
                vendor.tin,
                vendor.email,
                vendor.phone,
                vendor.website,
                vendor.image || null,
                (vendor.businessType || 'supermarket').toLowerCase()
            ]
        );

        const vendorId = vendor.regCode;



        // 3. Insert Branches (Generate IDs)
        const branchIdMap = new Map(); // Map UI-ID -> Server-ID
        if (branches && branches.length > 0) {
            for (const branch of branches) {
                const newBranchId = generateId('BZWB');

                await query(
                    `INSERT INTO branches (id, vendor_id, name, address, map_pin, phone, is_busy, opening_hours, closing_hours)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [newBranchId, vendorId, branch.name, branch.address, branch.coordinates, branch.phone, branch.isBusy, branch.openingHours || null, branch.closingHours || null]
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
            console.log(`Sending Welcome Email to Vendor: ${vendor.email}`);
            await sendStoreId(vendor.email, vendor.name, vendorId);

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

        res.status(201).json({ message: 'Registration successful', partnerId: vendorId });

    } catch (err) {
        await query('ROLLBACK');
        console.error('Registration error:', err);

        if (err.code === '23505') {
            return res.status(400).json({ error: 'Duplicate entry detected: One of the unique identifiers (TIN, Store ID, or Email) is already in use.' });
        }

        res.status(500).json({ error: 'Registration failed. Please try again later.' });
    }
});



router.post('/login', async (req, res) => {
    const { regCode } = req.body;
    try {
        const result = await query('SELECT * FROM vendors WHERE id = $1', [regCode]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invalid Store ID Code' });
        }

        const vendor = result.rows[0];
        // Generate JWT Token
        const token = jwt.sign(
            { id: vendor.id, name: vendor.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ success: true, token, vendor });
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
        const result = await query('SELECT * FROM branches WHERE vendor_id = $1', [supermarketId]);
        // Map database fields to frontend structure if necessary (e.g., map_pin -> coordinates)
        const branches = result.rows.map(b => ({
            id: b.id,
            name: b.name,
            address: b.address,
            coordinates: b.map_pin,
            phone: b.phone,
            isBusy: b.is_busy,
            openingHours: b.opening_hours,
            closingHours: b.closing_hours
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
    const { name, address, coordinates, phone, openingHours, closingHours } = req.body;

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
            `INSERT INTO branches (id, vendor_id, name, address, map_pin, phone, is_busy, opening_hours, closing_hours)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [newBranchId, supermarketId, name, address, coordinates || '', phone || '', false, openingHours || null, closingHours || null]
        );

        res.status(201).json({ success: true, message: 'Branch added successfully', branchId: newBranchId });
    } catch (err) {
        console.error('Error adding branch:', err);
        res.status(500).json({ error: 'Failed to add branch' });
    }
});

// Delete a Branch (Protected)
router.delete('/:supermarketId/branches/:branchId', authenticateToken, async (req, res) => {
    const { supermarketId, branchId } = req.params;

    // Security: ensure the JWT owner matches the vendor
    if (req.user.id !== supermarketId) {
        return res.status(403).json({ error: 'Unauthorized action' });
    }

    try {
        // Verify the branch belongs to this vendor
        const ownerCheck = await query(
            'SELECT 1 FROM branches WHERE id = $1 AND vendor_id = $2',
            [branchId, supermarketId]
        );

        if (ownerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found or unauthorized' });
        }

        // Delete associated managers first (foreign key safety)
        await query('DELETE FROM managers WHERE branch_id = $1', [branchId]);

        // Delete the branch
        await query('DELETE FROM branches WHERE id = $1', [branchId]);

        res.json({ success: true, message: 'Branch deleted successfully' });
    } catch (err) {
        console.error('Error deleting branch:', err);
        res.status(500).json({ error: 'Failed to delete branch' });
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
        const branchCheck = await query('SELECT 1 FROM branches WHERE id = $1 AND vendor_id = $2', [branchId, supermarketId]);
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
             WHERE m.id = $1 AND b.vendor_id = $2`,
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





// Migration route for business_type
router.get('/migrate', async (req, res) => {
    try {
        await query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='business_type') THEN 
                    ALTER TABLE vendors ADD COLUMN business_type VARCHAR(50) DEFAULT 'supermarket'; 
                END IF; 
            END $$;
        `);
        res.json({ success: true, message: 'Vendor table migration successful.' });
    } catch (err) {
        console.error('Migration failed:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
