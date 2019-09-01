import express from 'express';
import user_controller from '../controllers/user_controller';
import { validsignUp, validSignin } from '../middleware/userValidator';
import verify from '../middleware/verifyAdmin';

const { verifyAdmin } = verify;


const router = express.Router();

// signup endpoint
// Creation of Object
router.post('/signup', validsignUp, user_controller.UserController.signUp);
// Login user endpoint
router.post('/signin', validSignin, user_controller.UserController.signIn);
// change a mentee
router.patch('/user/:userId', verifyAdmin, user_controller.UserController.changeMentee);

export default router;
