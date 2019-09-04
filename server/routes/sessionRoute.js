import express from 'express';
import session_controller from '../controllers/sessionController';
import { validcreateSession, validReviewMentor } from '../middleware/sessionValidator';
import reviewController from '../controllers/reviewController';
import verify from '../middleware/autho';
import Verify from '../middleware/verifyAdmin';
import verifymentor from '../middleware/verifyMentor';

const { verifyMentor } = verifymentor;
const { verifyAdmin } = Verify;

const { verifyUser } = verify;
const router = express.Router();
router.post('/', validcreateSession, verifyUser, session_controller.SessionController.createSession);
router.patch('/:sessionid/accept', verifyMentor, session_controller.SessionController.AcceptSession);

router.post('/:sessionid/review', validReviewMentor, verifyUser, reviewController.ReviewController.createReview);
router.patch('/:sessionid/reject', verifyMentor, session_controller.SessionController.RejectSession);
router.delete('/:sessionid/review', verifyAdmin, reviewController.ReviewController.deleteReview);
export default router;
