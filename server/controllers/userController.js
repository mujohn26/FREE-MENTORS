import * as HttpStatus from 'http-status-codes';
import Model from '../models/db';
import encryptedPassword from '../helpers/Encryptor';
import Token from '../helpers/tokens';
import response from '../helpers/responseHandler';


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
      return response.successMessage(req, res, 'user created succefully', 201, token);
    } catch (e) {
      return response.errorMessage(req, res, 'server error', HttpStatus.INTERNAL_SERVER_ERROR, 'error');
    }
  };
}
export default { UserController };
