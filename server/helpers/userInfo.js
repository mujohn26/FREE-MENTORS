import jwt from 'jsonwebtoken';
import status from './StatusCode';

export const getUserId = (token, res) => {
  try {
    const decoded = jwt.verify(token, process.env.freeMentors_jwtSecret);
    return decoded.Id;
  } catch (error) {
    return res.status(status.BAD_REQUEST).send({ status: 'error', error: error.message });
  }
};
export const getUserEmail = (token, res) => {
  try {
    const decoded = jwt.verify(token, process.env.freeMentors_jwtSecret);
    return decoded.userEmail;
  } catch (error) {
    return res.status(status.BAD_REQUEST).send({ status: 'error', error: error.message });
  }
};
