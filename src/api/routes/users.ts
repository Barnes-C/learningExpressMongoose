import express from 'express';
import UsersController from '../controllers/users';

const router = express.Router();

router.route('/').get(UsersController.getAll);
router.route('/:id').get(UsersController.findById);
router.route('/signup').post(UsersController.signUp);
router.route('/login').post(UsersController.login);
router.route('/:id').delete(UsersController.deleteById);

export = router;
