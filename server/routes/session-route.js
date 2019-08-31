import express from 'express';
import session_controller from '../controllers/session_controller';

import { validcreateSession, validReviewMentor } from '../middleware/sessionValidator';
import verify from '../middleware/autho';

import verifymentor from '../middleware/verifyMentor';

const { verifyMentor } = verifymentor;

const { verifyUser } = verify;
const router = express.Router();
// users create sessions

router.post('/', validcreateSession, verifyUser, session_controller.SessionController.createSession);

// accept session
router.patch('/:sessionid/accept', verifyMentor, session_controller.SessionController.AcceptSession);


// Reveiw a mentor
router.post('/:sessionid/review', validReviewMentor, verifyUser, session_controller.SessionController.createReview);
// decline session
router.patch('/:sessionid/reject', verifyMentor, session_controller.SessionController.RejectSession);

export default router;
