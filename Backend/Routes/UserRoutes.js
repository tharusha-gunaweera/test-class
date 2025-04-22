const express = require('express');
const router  = express.Router();
//insert user contoller
const UserController = require("../Controllers/userControll");

router.get('/',UserController.getAllUsers);
router.post('/',UserController.addUsers);
router.get('/:id',UserController.getById);
router.get("/username/:username", UserController.getByUsername);
router.get("/email/:email", UserController.getByEmail);
router.put('/:id',UserController.updateUsers);
router.delete('/:id',UserController.deleteUser);

// Login route
router.post('/login', UserController.login);

module.exports = router;

