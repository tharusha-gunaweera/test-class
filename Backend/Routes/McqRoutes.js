const express = require('express');
const router  = express.Router();
//insert user contoller
const McqController = require("../Controllers/McqControll");

router.get('/',McqController.getAllMcqs);
router.post('/',McqController.addMcq);
router.get('/:id',McqController.getById);
router.put('/:id',McqController.updateMcq);
router.delete('/:id',McqController.deleteMcq);

module.exports = router;

