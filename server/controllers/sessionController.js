import * as HttpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import SessionModel from '../models/sessionModel';
import User from './userController';
import { getUserId, getUserEmail } from '../helpers/userInfo';

const SessionsData = [
  {
    sessionId: 1,
    mentorid: 3,
    questions: 'studying',
    menteeId: 2,
    menteeEmail: 'mj06@gmail.com',
    status: 'accepted',
  },

];
dotenv.config();

class SessionController {
  static createSession = (req, res) => {
    const sessionId = SessionsData.length + 1;
    const status = 'pending';
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
    const isMentor = User.users.find(u => u.id === parseInt(req.body.mentorid, 10));
    if (!isMentor) {
      return res.status(HttpStatus.NOT_FOUND).send({
        status: HttpStatus.NOT_FOUND,
        error: `No mentor available with id ${req.body.mentorid}`,
      });
    }
    if (!isMentor.isMentor) {
      return res.status(HttpStatus.NOT_FOUND).send({
        status: HttpStatus.NOT_FOUND,
        error: 'the the requested Id is not a mentor',
      });
    }
    SessionsData.push(newSession);
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
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

static AcceptSession = (req, res) => {
  const idmentor = getUserId(req.header('x-auth-token'), res);
  const { sessionid } = req.params;
  const mentorAccept = SessionsData.find(u => u.sessionId === parseInt(sessionid, 10));
  if (!mentorAccept) {
    return res.status(HttpStatus.NOT_FOUND).send({
      status: HttpStatus.NOT_FOUND,
      error: `No session available with id ${sessionid}`,
    });
  }
  if (mentorAccept.status === 'pending' && mentorAccept.mentorid === idmentor) {
    mentorAccept.status = 'accepted';
    return res.status(HttpStatus.OK).send({
      status: HttpStatus.OK,
      message: 'succeed',
      data: mentorAccept,
    });
  }
  return res.status(HttpStatus.NOT_FOUND).send({
    status: HttpStatus.NOT_FOUND,
    error: 'No sessions for you',
  });
}

static RejectSession = (req, res) => {
  const idmentor = getUserId(req.header('x-auth-token'), res);
  const { sessionid } = req.params;
  const mentorAccept = SessionsData.find(u => u.sessionId === parseInt(sessionid, 10));
  if (!mentorAccept) {
    return res.status(HttpStatus.NOT_FOUND).send({
      status: HttpStatus.NOT_FOUND,
      error: `No session available with id ${sessionid}`,
    });
  }
  if ((mentorAccept.status === 'pending') && mentorAccept.mentorid === idmentor) {
    mentorAccept.status = 'rejected';
    return res.status(HttpStatus.OK).send({
      status: HttpStatus.OK,
      message: 'succeed',
      data: mentorAccept,
    });
  }
  return res.status(HttpStatus.NOT_FOUND).send({
    status: HttpStatus.NOT_FOUND,
    error: 'No sessions for you',
  });
}
}
export default { SessionController, SessionsData };
