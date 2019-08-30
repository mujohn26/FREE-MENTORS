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

//  ACCEPT SESSION REQUEST
static AcceptSession = (req, res) => {
  const idmentor = getUserId(req.header('x-auth-token'), res);
  // eslint-disable-next-line radix
  const { sessionid } = req.params;
  // eslint-disable-next-line radix
  const mentorAccept = SessionsData.find(u => u.sessionId === parseInt(sessionid));
  // checking for status of our session
  if (!mentorAccept) {
    return res.status(404).send({
      status: 404,
      error: `No session available with id ${sessionid}`,
    });
  }
  if (mentorAccept.status === 'pending' && mentorAccept.mentorid === idmentor) {
    mentorAccept.status = 'accepted';
    return res.status(200).send({
      status: 200,
      data: mentorAccept,
    });
  }
  return res.status(404).send({
    status: 404,
    error: 'No sessions for you',
  });
}
}

export default { SessionController, SessionsData };
