import * as HttpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import { getUserId } from '../helpers/userInfo';
import Model from '../models/db';
import response from '../helpers/responseHandler';


dotenv.config();
class ReviewController {
  static model() {
    return new Model('users');
  }

  static modelSession() {
    return new Model('sessions');
  }

  static reviewSession() {
    return new Model('review');
  }

static createReview = async (req, res) => {
  const { score, remark } = req.body;
  let { sessionid } = req.params;
  const menteeId = getUserId(req.header('x-auth-token'), res);
  const mentorReview = await this.modelSession().select('*', 'sessionid=$1', [sessionid]);
  const user = await this.model().select('*', 'id=$1', [menteeId]);
  if (!mentorReview[0]) {
    return response.errorMessage(req, res, 'No sessions with that session id', HttpStatus.NOT_FOUND, 'error');
  }
  const mentorId = mentorReview[0].mentorid;

  const menteename = `${user[0].firstname} ${user[0].lastname}`;
  if (mentorReview[0].status === 'pending') {
    return response.errorMessage(req, res, 'Your session still pending....', HttpStatus.NOT_FOUND, 'error');
  }
  if (mentorReview[0].status === 'rejected') {
    return response.errorMessage(req, res, 'Your session have rejected', HttpStatus.NOT_FOUND, 'error');
  }
  const cols = 'sessionid, mentorid,menteeid,score,menteename,remark';
  const sels = `'${sessionid}', '${mentorId}', '${menteeId}', '${score}','${menteename}','${remark}'`;
  let row = await this.reviewSession().insert(cols, sels);
  return response.successMessage(req, res, 'created', HttpStatus.CREATED, row);
}

static deleteReview = async (req, res) => {
  const { sessionid } = req.params;
  const review = await this.reviewSession().select('*', 'sessionid=$1', [sessionid]);
  if (!review[0]) {
    return response.errorMessage(req, res, 'No Reviews with that session id', HttpStatus.NOT_FOUND, 'error');
  }
  await this.reviewSession().delete('reviewid=$1', [review[0].reviewid]);
  return response.successMessage(req, res, 'successfully deleted', HttpStatus.CREATED);
}
}
export default { ReviewController };
