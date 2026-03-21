const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAcademicYears, createAcademicYear,
    getDepartments, createDepartment,
    getDuties, createDuty, deleteDuty, updateDuty,
    createUser,
    assignDutyToTeacher,
    assignTutor,
    getDashboardStats,
    getYearDrops,
    updateYearDropStatus,
    getUsers,
    unassignDuty,
    deleteUser,
    updateUserAdmin
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);

router.get('/academic-years', getAcademicYears);
router.post('/academic-years', createAcademicYear);

router.get('/departments', getDepartments);
router.post('/departments', createDepartment);

router.get('/duties', getDuties);
router.post('/duties', createDuty);
router.delete('/duties/:id', deleteDuty);
router.put('/duties/:id', updateDuty);

router.get('/year-drops', getYearDrops);
router.put('/year-drops/:id', updateYearDropStatus);

router.post('/users', createUser);
router.post('/assign-duty', assignDutyToTeacher);
router.post('/unassign-duty', unassignDuty);
router.post('/assign-tutor', assignTutor);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUserAdmin);

module.exports = router;
