import * as HttpStatus from 'http-status-codes';
import Model from '../models/db';
import verifytoken from '../helpers/tokens';

const model = new Model('users');

class Auth {
  static verifyUser = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        error: 'Provide a Token',
      });
    }
    try {
      const decode = verifytoken.verifyToken(token);
      const email = decode.userEmail;
      const user = await model.select('*', 'email=$1', [email]);
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).send({
          status: HttpStatus.UNAUTHORIZED,
          error: 'You are not a user',
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
