const express = require('express');
const router = express.Router();
const progressController = require('../Controllers/ProgressController');

router.post('/', progressController.createProgress);


router.get('/', progressController.getAllProgress);

router.get('/user/:userId', progressController.getProgressByUserId);

router.post('/quiz', progressController.updateQuizProgress);

router.put('/quiz', progressController.updateExistingProgress);

router.put('/:id', progressController.updateProgress);

router.delete('/:id', progressController.deleteProgress);

module.exports = router; 