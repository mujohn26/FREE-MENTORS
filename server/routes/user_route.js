import express from 'express';
import user_controller from '../controllers/user_controller';
import { validsignUp } from '../middleware/userValidator';


const router = express.Router();

// signup endpoint
// Creation of Object
router.post('/signup', validsignUp, user_controller.UserController.signUp);

export default router;
