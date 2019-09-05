import * as HttpStatus from 'http-status-codes';
import verifytoken from '../helpers/tokens';

class Auth {
  static verifyMentor(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        error: 'Provide a Token',
      });
    }
    try {
      const decode = verifytoken.verifyToken(token);
      if (decode.isMentor !== true) {
        return res.status(HttpStatus.UNAUTHORIZED).send({
          status: HttpStatus.UNAUTHORIZED,
          error: 'You are not a Mentor',
        });
      }
      next();
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).send({
        status: HttpStatus.NOT_FOUND,
        error: 'invalid token',
      });
    }
  }
}


export default Auth;
