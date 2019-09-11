import express from 'express';
import sessionController from '../controllers/sessionController';
import { validcreateSession } from '../middleware/sessionValidator';
import verify from '../middleware/autho';
import verifymentor from '../middleware/verifyMentor';

const { verifyMentor } = verifymentor;

const { verifyUser } = verify;
const router = express.Router();
router.post('/', validcreateSession, verifyUser, sessionController.SessionController.createSession);
router.patch('/:sessionid/accept', verifyMentor, sessionController.SessionController.AcceptSession);
export default router;
