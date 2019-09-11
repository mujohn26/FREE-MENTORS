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
}
export default { SessionController };
