import express from 'express';
import session_controller from '../controllers/sessionController';
import { validcreateSession, validReviewMentor } from '../middleware/sessionValidator';
import verify from '../middleware/autho';

import verifymentor from '../middleware/verifyMentor';

const { verifyMentor } = verifymentor;

const { verifyUser } = verify;
const router = express.Router();
router.post('/', validcreateSession, verifyUser, session_controller.SessionController.createSession);
router.patch('/:sessionid/accept', verifyMentor, session_controller.SessionController.AcceptSession);

router.post('/:sessionid/review', validReviewMentor, verifyUser, session_controller.SessionController.createReview);
router.patch('/:sessionid/reject', verifyMentor, session_controller.SessionController.RejectSession);

export default router;
