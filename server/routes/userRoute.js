import express from 'express';
import userController from '../controllers/userController';
import { validsignUp, validSignin } from '../middleware/userValidator';
import verify from '../middleware/verifyAdmin';

const { verifyAdmin } = verify;


const router = express.Router();

router.post('/signup', validsignUp, userController.UserController.signUp);
router.post('/signin', validSignin, userController.UserController.signIn);
router.patch('/user/:userId', verifyAdmin, userController.UserController.changeMentee);


export default router;
