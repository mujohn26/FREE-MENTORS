
import dotenv from 'dotenv';
import lodash from 'lodash';
import User from '../models/userModel';
import status from '../helpers/StatusCode';
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

dotenv.config();
class UserController {
     static signUp = (req, res) => {
       const id = users.length + 1;
       const isEmailTaken = users.find(user => user.email === req.body.email);
       if (isEmailTaken) {
         return res.status(409).send({ status: status.REQUEST_CONFLICT, error: `${req.body.email} is already taken!` });
       }
       let { isMentor } = req.body;
       if (isMentor === undefined) { isMentor = false; }
       let isAdmin = false;

       const user = new User(
         id, req.body.firstName, req.body.lastName,
         req.body.email, req.body.password, req.body.address, req.body.bio, req.body.occupation,
         req.body.expertise, isMentor, isAdmin,
       );
       const token = Token.generateToken(user.id, user.email, isMentor, isAdmin);
       users.push(user);
       return res.status(201).json({
         status: status.RESOURCE_CREATED,
         message: 'user Registered successfully',
         data: {
           token,
           id: user.id,
           firstName: user.firstName,
           lastName: user.lastName,
           email: user.email,
           address: user.address,
           occupation: user.occupation,
           expertise: user.expertise,
         },
       });
     };

     // USER LOGIN
     static signIn = (req, res) => {
       try {
         const isLogin = (email, password) => users.find(user => (user.email === email)
       && ((comparePassword(password, user.password))));
         if (isLogin(req.body.email, req.body.password)) {
           const login = users.find(user => user.email === req.body.email);
           const token = Token.generateToken(login.id, login.email, login.isAdmin, login.isMentor);
           return res.status(status.REQUEST_SUCCEDED).json({
             status: status.REQUEST_SUCCEDED,
             message: 'user signed in successfully',
             data: {
               token,
             },
           });
         }

         return res.status(status.UNAUTHORIZED).json({
           status: status.UNAUTHORIZED,
           error: 'Invalid Email or Password',
         });
       } catch (e) {
         return res.status(status.SERVER_ERROR).json({
           status: status.SERVER_ERROR,
           error: 'server error',
         });
       }
     }

  // CHANGE USER TO A MENTOR
  static changeMentee = (req, res) => {
    const { userId } = req.params;
    const user = users.find(u => u.id === parseInt(userId, 10));
    if (!user) {
      return res.status(404).send({
        status: status.NOT_FOUND,
        error: `No user available with id ${userId}`,
      });
    }
    if (user.isMentor) {
      return res.status(404).send({
        status: status.NOT_FOUND,
        error: 'already a mentor',
      });
    }
    user.isMentor = true;
    return res.status(200).send({
      status: 200,
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
      return res.status(404).send({
        status: status.NOT_FOUND,
        error: 'No available mentors',
      });
    }
    return res.status(200).send({
      status: status.REQUEST_SUCCEDED,
      message: 'succeed',
      data: mentors,
    });
  }

  // GET A SPECIFIC MENTOR

  static specificMentor = (req, res) => {
    const { mentorId } = req.params;
    if (isNaN(mentorId)) {
      return res.status(400).send({
        status: status.BAD_REQUEST,
        error: 'Mentor id should be integer',
      });
    }
    const mentor = users.find(u => u.id === parseInt(mentorId, 10));
    if (!mentor) {
      return res.status(404).send({
        status: status.NOT_FOUND,
        error: 'No mentors available with that Id',
      });
    }
    if (!mentor.isMentor) {
      return res.status(404).send({
        status: status.BAD_REQUEST,
        error: 'not yet a mentor',
      });
    }
    return res.status(200).send({
      status: status.REQUEST_SUCCEDED,
      message: 'succeed',
      data: lodash.pick(mentor, 'id', 'firstName', 'lastName', 'email', 'address', 'bio', 'occupation', 'expertise'),
    });
  }
}

export default { UserController, users };
