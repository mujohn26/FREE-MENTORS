import * as HttpStatus from 'http-status-codes';
import verifytoken from '../helpers/tokens';
import response from '../helpers/responseHandler';

class Auth {
  static verifyAdmin(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
      return response.errorMessage(req, res, 'Provide a Token', HttpStatus.BAD_REQUEST, 'error');
    }
    try {
      const decode = verifytoken.verifyToken(token);
      if (decode.isAdmin !== true) {
        return response.errorMessage(req, res, 'You are not a admin', HttpStatus.UNAUTHORIZED, 'error');
      }
      next();
    } catch (error) {
      return response.errorMessage(req, res, 'invalid token', HttpStatus.NOT_FOUND, 'error');
    }
  }
}


export default Auth;
