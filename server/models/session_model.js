import lodash from 'lodash';
import dotenv from 'dotenv';

dotenv.config();
class SessionModel {
  constructor(sessionId, mentorid, menteeId, questions, menteeEmail, status) {
    this.sessionId = sessionId;
    this.mentorid = mentorid;
    this.menteeId = menteeId;
    this.questions = questions;
    this.menteeEmail = menteeEmail;
    this.status = status;
  }
}


export default SessionModel;
