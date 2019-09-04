
import dotenv from 'dotenv';
import encryptedPassword from '../helpers/Encryptor';

dotenv.config();

class User {
  constructor(id, firstName, lastName, email, password,
    address, bio, occupation, expertise, isMentor, isAdmin) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = encryptedPassword(password);
    this.address = address;
    this.bio = bio;
    this.occupation = occupation;
    this.expertise = expertise;
    this.isAdmin = isAdmin;
    this.isMentor = isMentor;
  }
}
export default User;
