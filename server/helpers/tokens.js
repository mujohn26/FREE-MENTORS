import jwt from 'jsonwebtoken';

const Helper = {
  /* Generate token
*/

  generateToken(id, email, mentor, admin) {
    const token = jwt.sign({
      Id: id,
      userEmail: email,
      is_Mentor: mentor,
      is_admin: admin,
    },
    process.env.freeMentors_jwtSecret, { expiresIn: '1d' });
    return token;
  },

  /**
     * Verify Token
     */
  verifyToken(token) {
    return jwt.verify(token, process.env.freeMentors_jwtSecret);
  },

// eslint-disable-next-line semi
}

export default Helper;
