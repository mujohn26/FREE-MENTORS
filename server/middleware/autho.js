import * as HttpStatus from 'http-status-codes';
import Model from '../models/db';
import verifytoken from '../helpers/tokens';
import response from '../helpers/responseHandler';


const model = new Model('users');

class Auth {
  static verifyUser = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
      return response.errorMessage(req, res, 'Provide a Token', HttpStatus.BAD_REQUEST, 'error');
    }
    try {
      const decode = verifytoken.verifyToken(token);
      const email = decode.userEmail;
      const user = await model.select('*', 'email=$1', [email]);
      if (!user) {
        return response.errorMessage(req, res, 'You are not a user', HttpStatus.UNAUTHORIZED, 'error');
      }

      next();
    } catch (error) {
      return response.errorMessage(req, res, 'invalid token', HttpStatus.NOT_FOUND, 'error');
    }
  }
}


export default Auth;
