import * as HttpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import Model from '../models/db';
import response from '../helpers/responseHandler';
import { getUserId, getUserEmail } from '../helpers/userInfo';

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
      const isSession = await this.modelSession().select('*', 'mentorid=$1', [mentorid]);
      let count = 0;
      for (let i = 0; i < isSession.length; i += 1) {
        if (isSession[i].questions === questions) {
          count += 1;
        }
      }
      if (count >= 1) {
        return response.errorMessage(req, res, 'You requested same question to one mentor', HttpStatus.CONFLICT, 'error');
      }
      if (!isMentor[0]) {
        return response.errorMessage(req, res, `No mentor available with id ${mentorid}`, HttpStatus.NOT_FOUND, 'error');
      }
      if (!isMentor[0].ismentor) {
        return response.errorMessage(req, res, 'the requested Id is not a mentor', HttpStatus.NOT_FOUND, 'error');
      }


      const cols = 'mentorid, questions,menteeid,menteeemail,status';
      const sels = `'${mentorid}', '${questions}', '${menteeId}', '${menteeEmail}','${status}'`;
      let row = await this.modelSession().insert(cols, sels);
      return response.successMessage(req, res, 'session was created', HttpStatus.CREATED, row);
    } catch (e) {
      return response.errorMessage(req, res, 'server error', 500, 'error');
    }
  }

  static AcceptSession = async (req, res) => {
    const idMentor = getUserId(req.header('x-auth-token'), res);
    const { sessionid } = req.params;
    const mentorAccept = await this.modelSession().select('*', 'sessionid=$1', [sessionid]);
    if (!mentorAccept[0]) {
      return response.errorMessage(req, res, `No session available with id ${sessionid}`, HttpStatus.NOT_FOUND, 'error');
    }
    if (mentorAccept[0].status === 'pending' && mentorAccept[0].mentorid === idMentor) {
      await this.modelSession().update('status=$1', 'sessionid=$2', ['accepted', mentorAccept[0].sessionid]);
      const acceptedSession = await this.modelSession().select('*', 'sessionid=$1', [sessionid]);
      return response.successMessage(req, res, 'succeed', HttpStatus.OK, acceptedSession[0]);
    }
    return response.errorMessage(req, res, 'No sessions for you', HttpStatus.NOT_FOUND, 'error');
  }

  static RejectSession = async (req, res) => {
    const idMentor = getUserId(req.header('x-auth-token'), res);
    const { sessionid } = req.params;
    const mentorReject = await this.modelSession().select('*', 'sessionid=$1', [sessionid]);
    if (!mentorReject[0]) {
      return response.errorMessage(req, res, `No session available with id ${sessionid}`, HttpStatus.NOT_FOUND, 'error');
    }
    if ((mentorReject[0].status === 'pending') && mentorReject[0].mentorid === idMentor) {
      await this.modelSession().update('status=$1', 'sessionid=$2', ['rejected', sessionid]);
      const jectedSession = await this.modelSession().select('*', 'sessionid=$1', [sessionid]);
      return response.successMessage(req, res, 'succeed', HttpStatus.OK, jectedSession);
    }
    return response.errorMessage(req, res, 'No sessions for you', HttpStatus.NOT_FOUND, 'error');
  }
}
export default { SessionController };
