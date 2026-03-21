const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerStudent, loginUser, resetPasswordDirect } = require('../controllers/authController');

// Set up Multer for form data processing and file uploads -> local disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/register', upload.single('photo'), registerStudent);
router.post('/login', loginUser);
router.post('/reset-password-direct', resetPasswordDirect);

module.exports = router;
