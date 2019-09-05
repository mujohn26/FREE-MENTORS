import express from 'express';
import userController from '../controllers/userController';
import verify from '../middleware/autho';

const { verifyUser } = verify;

const router = express.Router();
router.get('/', verifyUser, userController.UserController.AllMentors);
router.get('/:mentorId', verifyUser, userController.UserController.specificMentor);


export default router;
