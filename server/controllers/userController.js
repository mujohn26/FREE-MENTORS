
import dotenv from 'dotenv';
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
    address: 'nyagatre',
    bio: 'mugiraneza',
    occupation: 'mugiraneza',
    expertise: 'umute',
    isAdmin: false,
    isMentor: true,
  },
];

dotenv.config();
class UserController {
     static signUp = (req, res) => {
       const id = users.length + 1;
       const isEmailTaken = users.find(user => user.email === req.body.email);
       if (isEmailTaken) {
         return res.status(409).send({ status: status.REQUEST_CONFLICT, message: `${req.body.email} is already taken!`, data: [] });
       }
       let { isMentor, isAdmin } = req.body;
       if (isMentor === undefined) { isMentor = false; }
       if (isAdmin === undefined) { isAdmin = false; }
       const user = new User(
         id, req.body.firstName, req.body.lastName,
         req.body.email, req.body.password, req.body.address, req.body.bio, req.body.occupation, 
         req.body.expertise, isMentor, isAdmin,
       );

       if (user.is_Mentor === undefined) { user.is_Mentor = false; }
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
         const token = Token.generateToken(req.body.email, users.id);
         if (isLogin(req.body.email, req.body.password)) {
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
           message: 'Invalid Email or Password',
           data: [],
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
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).send({
        status: status.NOT_FOUND,
        message: `No user available with id ${userId}`,
        data: [],
      });
    }
    if (user.is_Mentor) {
      return res.status(404).send({
        status: status.NOT_FOUND,
        message: 'already a mentor',
        data: [],
      });
    }
    user.is_Mentor = true;
    return res.status(200).send({
      status: 200,
      Message: 'User changed to a mentor successfully',
      data: {
        user,
      },
    });
  }


  // GET AVAILABLE ALL MENTORS
  static AllMentors = (req, res) => {
    const allMentors = users.filter(user => user.isMentor === true);
    if (allMentors.length <= 0) {
      return res.status(404).send({
        status: status.NOT_FOUND,
        message: 'No available mentors',
        data: [],
      });
    }
    return res.status(200).send({
      status: status.REQUEST_SUCCEDED,
      message: 'succeed',
      data: allMentors,
    });
  }

  // GET A SPECIFIC MENTOR

  static specificMentor = (req, res) => {
    const { mentorId } = req.params;
    if (isNaN(mentorId)) {
      return res.status(400).send({
        status: status.BAD_REQUEST,
        message: 'Mentor id should be integer',
        data: [],
      });
    }
    const mentor = users.find(u => u.id === parseInt(mentorId));
    if (!mentor) {
      return res.status(404).send({
        status: status.NOT_FOUND,
        message: 'No mentors available with that Id',
        data: [],
      });
    }
    if (!mentor.isMentor) {
      return res.status(404).send({
        status: status.BAD_REQUEST,
        message: 'not yet a mentor',
        data: [],
      });
    }
    return res.status(200).send({
      status: status.REQUEST_SUCCEDED,
      message: 'succeed',
      data: mentor,
    });
  }
}

export default { UserController, users };
