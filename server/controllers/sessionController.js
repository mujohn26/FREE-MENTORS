import * as HttpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import Model from '../models/db';
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
  static model() {
    return new Model('users');
  }

  static modelSession() {
    return new Model('sessions');
  }

  static createSession = async (req, res) => {
    try {
      let {
        mentorid,
        questions,
      } = req.body;
      const status = 'pending';
      const menteeId = getUserId(req.header('x-auth-token'), res);
      const menteeEmail = getUserEmail(req.header('x-auth-token'), res);
      const isMentor = await this.model().select('*', 'id=$1', [mentorid]);
      if (!isMentor[0]) {
        return res.status(HttpStatus.NOT_FOUND).send({
          status: HttpStatus.NOT_FOUND,
          error: `No mentor available with id ${mentorid}`,
        });
      }
      if (!isMentor[0].ismentor) {
        return res.status(HttpStatus.NOT_FOUND).send({
          status: HttpStatus.NOT_FOUND,
          error: 'the requested Id is not a mentor',
        });
      }
      const cols = 'mentorid, questions,menteeid,menteeemail,status';
      const sels = `'${mentorid}', '${questions}', '${menteeId}', '${menteeEmail}','${status}'`;
      let row = await this.modelSession().insert(cols, sels);
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: 'session was created',
        data: row,
      });
    } catch (e) {
      return res.status(500).json({
        status: 500,
        error: e,
        message: 'server error',
      });
    }
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
