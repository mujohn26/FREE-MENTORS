import express from 'express';
import user_controller from '../controllers/userController';
import verify from '../middleware/autho';

const { verifyUser } = verify;

const router = express.Router();
router.get('/', verifyUser, user_controller.UserController.AllMentors);
router.get('/:mentorId', verifyUser, user_controller.UserController.specificMentor);


export default router;
