const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
    getAssignedStudents, 
    getStudentClearanceSummary, 
    finalApproval,
    saveConductAndApprove,
    getYearDrops,
    updateYearDropStatus,
    deleteYearDrop,
    getTutorStats
} = require('../controllers/tutorController');

router.use(protect);
router.use(authorize('tutor'));

router.get('/stats', getTutorStats);
router.get('/students', getAssignedStudents);
router.get('/clearance/:student_id', getStudentClearanceSummary);
router.post('/final-approval', finalApproval);
router.post('/conduct-and-approve', saveConductAndApprove);

router.get('/year-drops', getYearDrops);
router.put('/year-drops/:id', updateYearDropStatus);
router.delete('/year-drops/:id', deleteYearDrop);

module.exports = router;
