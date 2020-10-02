const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/users');

router.route('/').get(UsersController.getAll);
router.route('/:id').get(UsersController.findById);
router.route('/signup').post(UsersController.signUp);
router.route('/login').post(UsersController.login);
router.route('/:id').delete(UsersController.deleteById);

module.exports = router;
