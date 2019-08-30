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


}

export default { UserController, users };
