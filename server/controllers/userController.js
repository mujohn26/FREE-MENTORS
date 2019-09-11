import * as HttpStatus from 'http-status-codes';
import lodash from 'lodash';
import Model from '../models/db';
import encryptedPassword from '../helpers/Encryptor';
import Token from '../helpers/tokens';
import response from '../helpers/responseHandler';
import comparePassword from '../helpers/decryptor';


class UserController {
  static model() {
    return new Model('users');
  }

  static signUp = async (req, res) => {
    try {
      let {
        firstName,
        lastName,
        email,
        password,
        address,
        bio,
        occupation,
        expertise,
      } = req.body;
      const user = await this.model().select('*', 'email=$1', [email]);
      if (user[0]) {
        return response.errorMessage(req, res, `${email} is already taken!`, HttpStatus.CONFLICT, 'error');
      }
      let { isMentor } = req.body;
      if (isMentor === undefined) { isMentor = false; }
      password = await encryptedPassword(password);
      let isAdmin = false;
      const cols = 'firstname, lastname,email,password,address,bio,occupation,expertise,ismentor,isadmin';
      const sels = `'${firstName}', '${lastName}', '${email}', '${password}', '${address}', '${bio}', '${occupation}', '${expertise}','${isMentor}','${isAdmin}'`;
      let row = await this.model().insert(cols, sels);

      let token = Token.generateToken(row[0].id, row[0].email, row[0].ismentor, row[0].isadmin);
      const data = {
        token,
      };
      return response.successMessage(req, res, 'user created succefully', 201, data);
    } catch (e) {
      return response.errorMessage(req, res, 'server error', HttpStatus.INTERNAL_SERVER_ERROR, 'error');
    }
  };

     // USER LOGIN
     static signIn = async (req, res) => {
       try {
         const { email, password } = req.body;
         const isLogin = await this.model().select('*', 'email=$1', [email]);
         if (isLogin[0] && (comparePassword(password, isLogin[0].password))) {
           const token = Token.generateToken(isLogin[0].id, isLogin[0].email,
             isLogin[0].ismentor, isLogin[0].isadmin);
           const data = {
             token,
           };
           return response.successMessage(req, res, 'user signed in successfully', HttpStatus.OK, data);
         }

         return response.errorMessage(req, res, 'Invalid Email or Password', HttpStatus.UNAUTHORIZED, 'error');
       } catch (e) {
         return response.errorMessage(req, res, 'server error', HttpStatus.INTERNAL_SERVER_ERROR, 'error');
       }
     }

     // CHANGE USER TO A MENTOR
  static changeMentee = async (req, res) => {
    const { userId } = req.params;
    const user = await this.model().select('*', 'id=$1', [userId]);

    if (!user[0]) {
      return response.errorMessage(req, res, `No user available with id ${userId}`, HttpStatus.NOT_FOUND, 'error');
    }
    if (user[0].ismentor === true) {
      return response.errorMessage(req, res, 'already a mentor', HttpStatus.NOT_FOUND, 'error');
    }
    await this.model().update('ismentor=$1', 'id= $2', [true, user[0].id]);
    const ismentor = !user[0].ismentor;
    const data = {
      ismentor,
    };
    return response.successMessage(req, res, 'User changed to a mentor successfully', HttpStatus.OK, data);
  }

  // GET ALL MENTORS
  static AllMentors = async (req, res) => {
    const mentors = [];
    const isMentor = true;
    const mentor = await this.model().select('*', 'ismentor=$1', [isMentor]);
    for (let item = 0; item < mentor.length; item += 1) {
      mentors.push(lodash.pick(mentor[item],
        ['id', 'firstName', 'lastName', 'email',
          'address', 'bio', 'occupation', 'expertise']));
    }
    if (mentors.length <= 0) {
      return response.errorMessage(req, res, 'No available mentors', HttpStatus.NOT_FOUND, 'error');
    }
    const data = {
      mentors,
    };
    return response.successMessage(req, res, 'succeed', HttpStatus.OK, data);
  }

  // GET SPECIFIC MENTOR

  static specificMentor = async (req, res) => {
    const { mentorId } = req.params;
    if (isNaN(mentorId)) {
      return response.errorMessage(req, res, 'Mentor id should be integer', HttpStatus.BAD_REQUEST, 'error');
    }
    const mentor = await this.model().select('*', 'id=$1', [mentorId]);
    if (!mentor[0]) {
      return response.errorMessage(req, res, 'No mentors available with that Id', HttpStatus.NOT_FOUND, 'error');
    }
    if (mentor[0].isMentor === false) {
      return response.errorMessage(req, res, 'not yet a mentor', HttpStatus.BAD_REQUEST, 'error');
    }
    const data = lodash.pick(mentor[0],
      ['id', 'firstName', 'lastName', 'email',
        'address', 'bio', 'occupation', 'expertise']);

    return response.successMessage(req, res, 'succeed', HttpStatus.OK, data);
  }
}

export default { UserController };
