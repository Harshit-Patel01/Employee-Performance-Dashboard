const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

// Employee routes
router.post('/', addEmployee);
router.get('/', getAllEmployees);
router.get('/search', searchEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
