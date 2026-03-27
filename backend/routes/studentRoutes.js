const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getMyStatus, applyForClearance, submitYearDrop, updatePhoto, downloadClearancePDF } = require('../controllers/studentController');

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

router.use(protect);
router.use(authorize('student'));

router.get('/status', getMyStatus);
router.get('/download-pdf', downloadClearancePDF);
router.post('/apply', applyForClearance);
router.post('/year-drop', submitYearDrop);
router.post('/upload-photo', upload.single('photo'), updatePhoto);

module.exports = router;
