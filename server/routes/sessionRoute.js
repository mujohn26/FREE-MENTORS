import express from 'express';
import sessionController from '../controllers/sessionController';
import { validcreateSession, validReviewMentor } from '../middleware/sessionValidator';
import verify from '../middleware/autho';
import verifymentor from '../middleware/verifyMentor';
import reviewController from '../controllers/reviewController';

const { verifyMentor } = verifymentor;

const { verifyUser } = verify;
const router = express.Router();
router.post('/', validcreateSession, verifyUser, sessionController.SessionController.createSession);
router.patch('/:sessionid/accept', verifyMentor, sessionController.SessionController.AcceptSession);
router.patch('/:sessionid/reject', verifyMentor, sessionController.SessionController.RejectSession);
router.post('/:sessionid/review', validReviewMentor, verifyUser, reviewController.ReviewController.createReview);
router.delete('/:sessionid/review', verifyUser, reviewController.ReviewController.deleteReview);
export default router;
