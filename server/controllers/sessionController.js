
import dotenv from 'dotenv';
import SessionModel from '../models/sessionModel';
import User from './userController';
import { getUserId, getUserEmail } from '../helpers/userInfo';

const SessionsData = [];

dotenv.config();

class SessionController {
  static createSession = (req, res) => {
    const sessionId = SessionsData.length + 1;
    const status = 'pending';
    const menteeId = getUserId(req.header('x-auth-token'), res);
    const menteeEmail = getUserEmail(req.header('x-auth-token'), res);
    const newSession = new SessionModel(
      sessionId,
      req.body.mentorid,
      menteeId,
      req.body.questions,
      menteeEmail,
      status,
    );
    const isMentor = User.users.find(u => u.id === parseInt(req.body.mentorid));
    if (!isMentor) {
      return res.status(404).send({
        status: 404,
        message: `No mentor available with id ${req.body.mentorid}`,
        data: [],
      });
    }
    if (!isMentor.isMentor) {
      return res.status(404).send({
        status: 404,
        message: 'the the requested Id is not a mentor',
        data: [],
      });
    }
    SessionsData.push(newSession);
    return res.status(201).json({
      status: 201,
      message: 'session was created',
      data: {
        sessionId,
        mentorid: newSession.mentorid,
        questions: newSession.questions,
        menteeId,
        menteeEmail,
        status,
      },
    });
  }

static AcceptSession = (req, res) => {
  const idmentor = getUserId(req.header('x-auth-token'), res);
  const { sessionid } = req.params;
  const mentorAccept = SessionsData.find(u => u.sessionId === parseInt(sessionid));
  if (!mentorAccept) {
    return res.status(404).send({
      status: 404,
      message: `No session available with id ${sessionid}`,
      data: [],
    });
  }
  if (mentorAccept.status === 'pending' && mentorAccept.mentorid === idmentor) {
    mentorAccept.status = 'accepted';
    return res.status(200).send({
      status: 200,
      message: 'succeed',
      data: mentorAccept,
    });
  }
  return res.status(404).send({
    status: 404,
    message: 'No sessions for you',
    data: [],
  });
}

static RejectSession = (req, res) => {
  const idmentor = getUserId(req.header('x-auth-token'), res);
  const { sessionid } = req.params;
  const mentorAccept = SessionsData.find(u => u.sessionId === parseInt(sessionid));
  if (!mentorAccept) {
    return res.status(404).send({
      status: 404,
      message: `No session available with id ${sessionid}`,
      data: [],
    });
  }
  if ((mentorAccept.status === 'pending') && mentorAccept.mentorid === idmentor) {
    mentorAccept.status = 'rejected';
    return res.status(200).send({
      status: 200,
      message: 'succeed',
      data: mentorAccept,
    });
  }
  return res.status(404).send({
    status: 404,
    message: 'No sessions for you',
    data: [],
  });
}

static createReview = (req, res) => {
  const { score, remark } = req.body;
  const { sessionid } = req.params;
  const menteeId = getUserId(req.header('x-auth-token'), res);
  const mentorReview = SessionsData.find(u => u.sessionId === parseInt(sessionid));
  const mentorreview = User.users.find(u => u.id === parseInt(menteeId));
  const menteeName = mentorreview.firstName + mentorreview.lastName;

  if (mentorReview.menteeId !== menteeId) {
    return res.status(404).send({
      status: 404,
      message: 'No sessions with that id',
      data: [],
    });
  }
  if (mentorReview.status === 'pending') {
    return res.status(404).send({
      status: 404,
      message: 'Your session still pending....',
      data: [],
    });
  }
  if (mentorReview.status === 'rejected') {
    return res.status(404).send({
      status: 404,
      message: 'Your session have rejected',
      data: [],
    });
  }

  return res.status(200).send({
    status: 200,
    message: 'succeed',
    data: {
      sessionid,
      mentorId: mentorReview.mentorid,
      menteId: menteeId,
      Score: score,
      MenteeFullName: menteeName,
      remark,

    },
  });
}
}
export default { SessionController, SessionsData };
