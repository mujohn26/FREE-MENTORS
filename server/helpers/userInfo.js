import jwt from 'jsonwebtoken';

export const getUserId = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.freeMentors_jwtSecret);
    return decoded.Id;
  } catch (error) {
    return null;
  }
};
export const getUserEmail = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.freeMentors_jwtSecret);
    return decoded.userEmail;
  } catch (error) {
    return null;
  }
};
