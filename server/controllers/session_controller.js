/* eslint-disable radix */
/* eslint-disable import/no-duplicates */
/* eslint-disable function-paren-newline */
import dotenv from 'dotenv';
import SessionModel from '../models/session_model';
// SessionReview from '../models/session_model';
import User from './user_controller';
import { getUserId, getUserEmail } from '../helpers/userInfo';

const SessionsData = [
 
];
const ReviewData = [];

dotenv.config();

class SessionController {
  static createSession = (req, res) => {
    const sessionId = SessionsData.length + 1;
    const status = 'pending';
    // get mentee id and mentee Email using token
    const menteeId = getUserId(req.header('x-auth-token'), res);
    const menteeEmail = getUserEmail(req.header('x-auth-token'), res);
    const newSession = new SessionModel(
      sessionId,
      req.body.mentorid,
      menteeId,
      req.body.questions,
      menteeEmail,
      status,
    );
    const isMentor = User.users.find(u => u.id === parseInt(req.body.mentorid));
    if (!isMentor) {
      return res.status(404).send({
        status: 404,
        error: `No mentor available with id ${req.body.mentorid}`,
      // eslint-disable-next-line semi
      })
    }
    if (!isMentor.is_Mentor) {
      return res.status(404).send({
        status: 404,
        error: 'the the requested Id is not a mentor',
      // eslint-disable-next-line semi
      })
    }
    SessionsData.push(newSession);
    return res.status(201).json({
      status: 201,
      message: 'session was created',
      data: {
        sessionId,
        mentorid: newSession.mentorid,
        questions: newSession.questions,
        menteeId,
        menteeEmail,
        status,
      },
    });
  }
}

export default { SessionController, SessionsData };
