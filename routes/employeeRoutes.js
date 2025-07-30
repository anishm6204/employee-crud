const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const {
  authenticateToken,
  authorizeManager
} = require('../middleware/authMiddleware');


const employeeValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is not valid'),

  body('position')
    .optional()
    .isString().withMessage('Position must be a string')
    .isLength({ max: 100 }).withMessage('Position must be under 100 characters'),

  body('salary')
    .optional()
    .isInt({ min: 0 }).withMessage('Salary must be a non-negative number'),

  body('department_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Department ID must be a positive integer'),

  body('date_joined')
    .optional()
    .isISO8601().withMessage('Date must be a valid date'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'terminated']).withMessage('Invalid status'),
];


router.get('/', authenticateToken, getAllEmployees);


router.get('/:id', authenticateToken, getEmployeeById);


router.post('/',authenticateToken,authorizeManager, employeeValidationRules, createEmployee);


router.put('/:id',authenticateToken, authorizeManager, employeeValidationRules, updateEmployee);

router.delete('/:id',authenticateToken, authorizeManager, deleteEmployee);

module.exports = router;
