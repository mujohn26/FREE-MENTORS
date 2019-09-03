import User from '../controllers/userController';
import verifytoken from '../helpers/tokens';

class Auth {
  static verifyUser = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(400).send({
        message: 'Provide a Token',
      });
    }
    try {
      const decode = verifytoken.verifyToken(token);
      const loadedUser = User.users.find(u => u.email === decode.userEmail);
      if (!loadedUser) {
        return res.status(401).send({
          status: 401,
          error: 'You are not a user',
        });
      }

      next();
    } catch (error) {
      return res.status(404).send({
        status: 404,
        error: 'invalid token',
      });
    }
  }
}


export default Auth;
