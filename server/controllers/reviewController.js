import * as HttpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import ReviewModal from '../models/reviewModal';
import { getUserId } from '../helpers/userInfo';
import Session from './sessionController';
import User from './userController';

const reviewData = [
  {
    reviewId: 1,
    sessionid: 1,
    mentorId: 3,
    menteeId: 2,
    score: 3,
    menteeFullName: 'munezerpaime',
    remark: 'it was a good time just',
  },


];

dotenv.config();
class ReviewController {
static createReview = (req, res) => {
  const reviewId = reviewData.length + 1;
  const { score, remark } = req.body;
  let { sessionid } = req.params;
  const menteeId = getUserId(req.header('x-auth-token'), res);
  const mentorReview = Session.SessionsData.find(u => u.sessionId === parseInt(sessionid, 10));
  const user = User.users.find(u => u.id === parseInt(menteeId, 10));
  if (!mentorReview) {
    return res.status(HttpStatus.NOT_FOUND).send({
      status: HttpStatus.NOT_FOUND,
      error: 'No sessions with that session id',
    });
  }
  const mentorId = mentorReview.mentorid;
  const menteeFullName = user.firstName + user.lastName;
  if (mentorReview.status === 'pending') {
    return res.status(HttpStatus.NOT_FOUND).send({
      status: HttpStatus.NOT_FOUND,
      error: 'Your session still pending....',
    });
  }
  if (mentorReview.status === 'rejected') {
    return res.status(HttpStatus.NOT_FOUND).send({
      status: HttpStatus.NOT_FOUND,
      error: 'Your session have rejected',
    });
  }
  const review = new ReviewModal(
    reviewId,
    sessionid,
    mentorId,
    menteeId,
    score,
    menteeFullName,
    remark,
  );
  reviewData.push(review);
  return res.status(HttpStatus.CREATED).send({
    status: HttpStatus.CREATED,
    message: 'created',
    data: {
      reviewId,
      sessionid,
      mentorId,
      menteeId,
      score,
      menteeFullName,
      remark,

    },
  });
}

static deleteReview = (req, res) => {
  const { sessionid } = req.params;
  const review = reviewData.find(r => r.sessionid === parseInt(sessionid, 10));
  if (!review) {
    return res.status(HttpStatus.NOT_FOUND).send({
      status: HttpStatus.NOT_FOUND,
      error: 'No Reviews with that session id',
    });
  }
  const index = reviewData.indexOf(review);
  reviewData.splice(index, 1);
  return res.status(HttpStatus.OK).send({
    status: HttpStatus.OK,
    data: {
      message: 'succefully deleted',
    },
  });
}
}
export default { ReviewController, reviewData };
