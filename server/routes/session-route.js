import express from 'express';
import session_controller from '../controllers/session_controller';
import { validcreateSession } from '../middleware/sessionValidator';
import verify from '../middleware/autho';

const { verifyUser } = verify;
const router = express.Router();
// users create sessions

router.post('/', validcreateSession, verifyUser, session_controller.SessionController.createSession);


export default router;
