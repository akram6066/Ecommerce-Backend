// Import necessary packages
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('../Models/userModels.js');
const fs = require('fs');
const path = require('path');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'upload');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const filenameParts = file.originalname.split('.');
        const extension = filenameParts.pop();
        const filename = filenameParts.join('_') + '_' + Date.now() + '.' + extension;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Sign-up route
router.post('/signup', upload.single('photo'), async (req, res) => {
    try {
        const { name, username, email, password, userType } = req.body;
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });

        if (existingUserByEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        if (existingUserByUsername) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            username,
            email,
            password: hashedPassword,
            userType,
            photo: req.file ? req.file.path : undefined
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully', ...user._doc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Login route
// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        let user;

        console.log('Login attempt:', { email, username });

        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            user = await User.findOne({ username });
        }

        if (!user) {
            console.log('User not found with email or username:', { email, username });
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid password for user:', user);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '60d' });
        console.log('Login successful for user:', user);
        
        res.json({ ...user._doc, token });
    } catch (err) {
        console.error('Server error during login:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



// Get all users route
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user route
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, username, userType } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (username) updateData.username = username;
        if (userType) updateData.userType = userType;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (req.file) updateData.photo = req.file.path;

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user route
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
