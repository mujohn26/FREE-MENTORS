/* eslint-disable semi */
import dotenv from 'dotenv';
import User from '../models/user_model';
import status from '../helpers/StatusCode';
import Token from '../helpers/tokens';


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
    is_admin: false,
    is_Mentor: true,
  },
];

dotenv.config();
class UserController {
     static signUp = (req, res) => {
       const id = users.length + 1;
       const isEmailTaken = users.find(user => user.email === req.body.email);
       if (isEmailTaken) {
         // 409 = Conflict due to existing email
         return res.status(409).send({ status: 409, error: `${req.body.email} is already taken!, Give it another try different email.` });
       }
       // Everything is okay
       // We fire up User model to create user
       let { is_Mentor, is_admin } = req.body;
       // let is_mentor = req.body.is_Mentor;
       if (is_Mentor === undefined) { is_Mentor = false; }
       if (is_admin === undefined) { is_admin = false; }
       const user = new User(
         id, req.body.firstName, req.body.lastName,
         req.body.email, req.body.password, req.body.address, req.body.bio, req.body.occupation,
         req.body.expertise, is_Mentor, is_admin,
       );

       if (user.is_Mentor === undefined) { user.is_Mentor = false; }
       const token = Token.generateToken(user.id, user.email, is_Mentor, is_admin);

       users.push(user);
       // console.log(user.is_admin);
       return res.status(201).json({
         status: 201,
         message: 'user Registered successfully',
         data: {
           token,
           id: user.id,
           first_Name: user.firstName,
           last_Name: user.lastName,
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
       && ((user.password === password)));
         const token = Token.generateToken(req.body.email, req.body.id);
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
           error: 'Invalid Email or Password',
         });
       } catch (e) {
         // Catch any error if it rises
         return res.status(status.SERVER_ERROR).json({
           status: status.SERVER_ERROR,
           error: 'server error',
           // e,
         });
       }
     }

     
  // CHANGE USER TO A MENTOR
  static changeMentee = (req, res) => {
    const { userId } = req.params;
    // eslint-disable-next-line radix
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).send({
        status: 404,
        error: `No user available with id ${userId}`,
      })
    }
    if (user.is_Mentor) {
      return res.status(404).send({
        status: 404,
        error: 'already a mentor',
      })
    }
    user.is_Mentor = true;
    return res.status(200).send({
      status: 200,
      Message: 'User changed to a mentor successfully',
    })
  }

  
  // GET AVAILABLE ALL MENTORS
  static AllMentors = (req, res) => {
    const allMentors = users.filter(user => user.is_Mentor === true);
    if (allMentors.length <= 0) {
      return res.status(404).send({
        status: 404,
        message: 'No available mentors',
      });
    }
    return res.status(200).send({
      status: 200,
      data: allMentors,
    });
  }

  // GET A SPECIFIC MENTOR

  static specificMentor = (req, res) => {
    const { mentorId } = req.params;
    // eslint-disable-next-line radix
    if (isNaN(mentorId)) {
      return res.status(400).send({
        status: 400,
        error: 'Mentor id should be integer',
      })
    }
    const mentor = users.find(u => u.id === parseInt(mentorId));
    if (!mentor) {
      return res.status(404).send({
        status: 404,
        error: 'No mentors available with that Id',
      })
    }
    if (!mentor.is_Mentor) {
      return res.status(404).send({
        status: 404,
        error: 'not yet a mentor',
      })
    }
    return res.status(200).send({
      status: 200,
      data: mentor,
    })
  }
}

export default { UserController, users };
