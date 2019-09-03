
import verifytoken from '../helpers/tokens';

class Auth {
  static verifyAdmin(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(400).send({
        status: 400,
        message: 'Provide a Token',
        data: [],
      });
    }
    try {
      const decode = verifytoken.verifyToken(token);
      if (decode.is_admin !== true) {
        return res.status(401).send({
          status: 401,
          message: 'You are not a admin',
          data: [],
        });
      }
      next();
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: 'invalid token',
        data: [],
      });
    }
  }
}


export default Auth;
