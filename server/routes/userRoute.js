import express from 'express';
import user_controller from '../controllers/userController';
import { validsignUp, validSignin } from '../middleware/userValidator';
import verify from '../middleware/verifyAdmin';

const { verifyAdmin } = verify;


const router = express.Router();

router.post('/signup', validsignUp, user_controller.UserController.signUp);
router.post('/signin', validSignin, user_controller.UserController.signIn);
router.patch('/user/:userId', verifyAdmin, user_controller.UserController.changeMentee);

export default router;
