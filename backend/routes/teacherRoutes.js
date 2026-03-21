const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getStudentsByDuty, updateStudentStatus, getStudentDutyStatuses, updateMultipleStatuses } = require('../controllers/teacherController');

router.use(protect);
router.use(authorize('teacher'));

router.get('/students', getStudentsByDuty);
router.get('/student-statuses/:student_id', getStudentDutyStatuses);
router.put('/update-status', updateStudentStatus);
router.put('/update-multiple-status', updateMultipleStatuses);

module.exports = router;
