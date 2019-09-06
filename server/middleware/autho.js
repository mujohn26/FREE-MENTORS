import * as HttpStatus from 'http-status-codes';
import User from '../controllers/userController';
import verifytoken from '../helpers/tokens';

class Auth {
  static verifyUser = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        error: 'Provide a Token',
      });
    }
    try {
      const decode = verifytoken.verifyToken(token);
      const loadedUser = User.users.find(u => u.email === decode.userEmail);
      if (!loadedUser) {
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
