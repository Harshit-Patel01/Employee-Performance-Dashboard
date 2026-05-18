const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  getMyProfile,
  searchEmployees,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

// Candidate: get own profile
router.get('/me', getMyProfile);

// HR-only routes
router.get('/', requireRole('hr'), getAllEmployees);
router.get('/search', requireRole('hr'), searchEmployees);
router.delete('/:id', requireRole('hr'), deleteEmployee);

// Both HR and candidate can add/update
router.post('/', addEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);

module.exports = router;
