import verifytoken from '../helpers/tokens';

class Auth {
  static verifyMentor(req, res, next) {
    const token = req.header('x-auth-token');
    // const decode = verifytoken.verifyToken(token);
    if (!token) {
      return res.status(400).send({
        message: 'Provide a Token',
      });
    }
    try {
      const decode = verifytoken.verifyToken(token);
      if (decode.is_Mentor !== true) {
        return res.status(401).send({
          status: 401,
          error: 'You are not a Mentor',
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
