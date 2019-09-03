import User from '../controllers/userController';
import verifytoken from '../helpers/tokens';

class Auth {
  static verifyUser = (req, res, next) => {
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
      const loadedUser = User.users.find(u => u.email === decode.userEmail);
      if (!loadedUser) {
        return res.status(401).send({
          status: 401,
          message: 'You are not a user',
          data: [],
        });
      }

      next();
    } catch (error) {
      return res.status(404).send({
        status: 404,
        message: 'invalid token',
        data: [],
      });
    }
  }
}


export default Auth;
