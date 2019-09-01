// eslint-disable-next-line no-unused-vars
import User from '../controllers/user_controller';
import verifytoken from '../helpers/tokens';

class Auth {
  static verifyAdmin(req, res, next) {
    const token = req.header('x-auth-token');
    // const decode = verifytoken.verifyToken(token);
    if (!token) {
      return res.status(400).send({
        message: 'Provide a Token',
      });
    }
    try {
      const decode = verifytoken.verifyToken(token);
      if (decode.is_admin !== true) {
        return res.status(401).send({
          status: 401,
          error: 'You are not a admin',
        });
      }
      next();
    } catch (error) {
      return res.status(401).send({
        status: 401,
        error: 'invalid token',
      });
    }
  }
}


export default Auth;
