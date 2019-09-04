import jwt from 'jsonwebtoken';

const Helper = {

  generateToken(id, email, mentor, admin) {
    const token = jwt.sign({
      Id: id,
      userEmail: email,
      isMentor: mentor,
      isAdmin: admin,
    },
    process.env.freeMentors_jwtSecret, { expiresIn: '1d' });
    return token;
  },

  verifyToken(token) {
    return jwt.verify(token, process.env.freeMentors_jwtSecret);
  },
};

export default Helper;
