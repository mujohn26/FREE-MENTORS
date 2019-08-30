import express from 'express';
import user_controller from '../controllers/user_controller';
import { validsignUp, validSignin } from '../middleware/userValidator';


const router = express.Router();

// signup endpoint
// Creation of Object
router.post('/signup', validsignUp, user_controller.UserController.signUp);
// Login user endpoint
router.post('/signin', validSignin, user_controller.UserController.signIn);

export default router;
