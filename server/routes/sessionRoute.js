import express from 'express';
import sessionController from '../controllers/sessionController';
import { validcreateSession } from '../middleware/sessionValidator';
import verify from '../middleware/autho';

const { verifyUser } = verify;
const router = express.Router();
router.post('/', validcreateSession, verifyUser, sessionController.SessionController.createSession);

export default router;
