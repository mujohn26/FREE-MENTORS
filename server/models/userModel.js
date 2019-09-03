
import dotenv from 'dotenv';

dotenv.config();

class User {
  constructor(id, firstName, lastName, email, password,
    address, bio, occupation, expertise, is_Mentor, is_admin) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.address = address;
    this.bio = bio;
    this.occupation = occupation;
    this.expertise = expertise;
    this.is_admin = is_admin;
    this.is_Mentor = is_Mentor;
  }


    isUserExist = user_id => this.users.find(u => u.id === user_id);
}
export default User;
