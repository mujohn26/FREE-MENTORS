import express from 'express';
import user_controller from '../controllers/user_controller';
import verify from '../middleware/autho';

const { verifyUser } = verify;

const router = express.Router();
// User view all mentors
router.get('/', verifyUser, user_controller.UserController.AllMentors);


export default router;
