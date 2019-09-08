import * as HttpStatus from 'http-status-codes';
import lodash from 'lodash';
import Model from '../models/db';
import encryptedPassword from '../helpers/Encryptor';
import Token from '../helpers/tokens';
import comparePassword from '../helpers/decryptor';


const users = [
  {
    id: 1,
    firstName: 'murengezi',
    lastName: 'aime',
    email: 'mujoh13@gmail.com',
    password: 'mugiraneza',
    address: 'nyagatare',
    bio: 'born in Rwanda',
    occupation: 'nurse',
    expertise: 'midwife',
    isAdmin: false,
    isMentor: true,
  },
  {
    id: 2,
    firstName: 'mugiraneza',
    lastName: 'john',
    email: 'mujohn25@gmail.com',
    password: '$2b$10$95FUvTPs.daGdHiHqlvdUuclxEZapHkjeomNYLwyGpzuCB/Uj7GI6',
    address: 'kigali',
    bio: 'born in Rwanda',
    occupation: 'developer',
    expertise: 'javascript',
    isAdmin: true,
    isMentor: true,
  },
];

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
        return res.status(HttpStatus.CONFLICT).json({
          status: HttpStatus.CONFLICT,
          error: `${email} is already taken!`,
        });
      }
      let { isMentor } = req.body;
      if (isMentor === undefined) { isMentor = false; }
      password = await encryptedPassword(password);
      let isAdmin = false;
      const cols = 'firstname, lastname,email,password,address,bio,occupation,expertise,ismentor,isadmin';
      const sels = `'${firstName}', '${lastName}', '${email}', '${password}', '${address}', '${bio}', '${occupation}', '${expertise}','${isMentor}','${isAdmin}'`;
      let row = await this.model().insert(cols, sels);

      let token = Token.generateToken(row[0].id, row[0].email, row[0].ismentor, row[0].isadmin);
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: 'user Registered successfully',
        data: {
          token,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: 500,
        error: e,
        message: 'server error',
      });
    }
  };

     // USER LOGIN
     static signIn = async (req, res) => {
       try {
         const { email, password } = req.body;
         const isLogin = await this.model().select('*', 'email=$1', [email]);
         if (isLogin[0] && (comparePassword(password, isLogin[0].password))) {
           const token = Token.generateToken(isLogin[0].id, isLogin[0].email, isLogin[0].ismentor, isLogin[0].isadmin);
           return res.status(HttpStatus.OK).json({
             status: HttpStatus.OK,
             message: 'user signed in successfully',
             data: {
               token,
             },

           });
         }

         return res.status(HttpStatus.UNAUTHORIZED).json({
           status: HttpStatus.UNAUTHORIZED,
           error: 'Invalid Email or Password',
         });
       } catch (e) {
         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
           status: HttpStatus.INTERNAL_SERVER_ERROR,
           error: e,
         });
       }
     }

  // CHANGE USER TO A MENTOR
  static changeMentee = (req, res) => {
    const { userId } = req.params;
    const user = users.find(u => u.id === parseInt(userId, 10));
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send({
        status: HttpStatus.NOT_FOUND,
        error: `No user available with id ${userId}`,
      });
    }
    if (user.isMentor) {
      return res.status(HttpStatus.NOT_FOUND).send({
        status: HttpStatus.NOT_FOUND,
        error: 'already a mentor',
      });
    }
    user.isMentor = true;
    return res.status(HttpStatus.OK).send({
      status: HttpStatus.OK,
      Message: 'User changed to a mentor successfully',
      data: {
        data: lodash.pick(user, 'id', 'firstName', 'lastName', 'email', 'address', 'bio', 'occupation', 'expertise', 'isMentor'),
      },
    });
  }


  // GET AVAILABLE ALL MENTORS
  static AllMentors = (req, res) => {
    const mentors = [];
    for (let item = 0; item < users.length; item += 1) {
      if (users[item].isMentor === true) {
        const mentor = users[item];
        mentors.push(lodash.pick(mentor,
          ['id', 'firstName', 'lastName', 'email',
            'address', 'bio', 'occupation', 'expertise']));
      }
    }
    if (mentors.length <= 0) {
      return res.status(HttpStatus.NOT_FOUND).send({
        status: HttpStatus.NOT_FOUND,
        error: 'No available mentors',
      });
    }
    return res.status(HttpStatus.OK).send({
      status: HttpStatus.OK,
      message: 'succeed',
      data: mentors,
    });
  }

  // GET A SPECIFIC MENTOR

  static specificMentor = (req, res) => {
    const { mentorId } = req.params;
    if (isNaN(mentorId)) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        error: 'Mentor id should be integer',
      });
    }
    const mentor = users.find(u => u.id === parseInt(mentorId, 10));
    if (!mentor) {
      return res.status(HttpStatus.NOT_FOUND).send({
        status: HttpStatus.NOT_FOUND,
        error: 'No mentors available with that Id',
      });
    }
    if (!mentor.isMentor) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: HttpStatus.BAD_REQUEST,
        error: 'not yet a mentor',
      });
    }
    return res.status(HttpStatus.OK).send({
      status: HttpStatus.OK,
      message: 'succeed',
      data: lodash.pick(mentor, 'id', 'firstName', 'lastName', 'email', 'address', 'bio', 'occupation', 'expertise'),
    });
  }
}

export default { UserController, users };
