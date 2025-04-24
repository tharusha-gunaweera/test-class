const express = require('express');
const router = express.Router();
const ClassController = require('../Controllers/ClassController');

// Class routes
router.get('/', ClassController.getAllClasses);
router.post('/', ClassController.createClass);
router.get('/:id', ClassController.getClassById);
router.put('/:id', ClassController.updateClass);
router.delete('/:id', ClassController.deleteClass);

module.exports = router;
