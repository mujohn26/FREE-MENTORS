import express from 'express';
import session_controller from '../controllers/session_controller';
import { validcreateSession } from '../middleware/sessionValidator';
import verify from '../middleware/autho';

import verifymentor from '../middleware/verifyMentor';

const { verifyMentor } = verifymentor;


const { verifyUser } = verify;
const router = express.Router();
// users create sessions

router.post('/', validcreateSession, verifyUser, session_controller.SessionController.createSession);

// accept session
router.patch('/:sessionid/accept', verifyMentor, session_controller.SessionController.AcceptSession);
// decline session
router.patch('/:sessionid/reject', verifyMentor, session_controller.SessionController.RejectSession);

export default router;
