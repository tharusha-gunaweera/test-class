const express = require('express');
const router = express.Router();
const salaryController = require('../Controllers/SalaryController');

router.post('/calculate', salaryController.calculateSalary);
router.get('/', salaryController.getAllSalaries);
router.put('/:id', salaryController.updateSalary);
router.delete('/:id', salaryController.deleteSalary);

module.exports = router; 