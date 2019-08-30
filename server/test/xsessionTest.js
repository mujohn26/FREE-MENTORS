import jwt from 'jsonwebtoken';

import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import users from '../models/users';

import sessions from '../models/sessions';

import status from '../helpers/StatusCode';


import generateToken from '../helpers/tokens';

const { expect } = chai;

chai.use(chaiHttp);

// ############ MENTOR TEST ############
const meId = sessions[0].mentorid;
const qns = sessions[0].questions;
// Create a true token for testing
const token = generateToken.generateToken(1, users[0].email, false, true);
// Create a token with invalid user
const mentortoken = generateToken.generateToken(1, users[0].email, true, false)
const Invalidtoken = generateToken.generateToken(1, 'kkjkshj@gmail.com', false, true);
describe('POST User can request mentorship, api/v1/sessions', () => {
  it('should create a mentorship session successfully', (done) => {
    chai.request(app)
      .post('/api/v1/sessions')
      .send(sessions[0])
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.RESOURCE_CREATED);
        expect(res.status).to.equal(status.RESOURCE_CREATED);
        expect(res.body.data.mentorid).to.equal(meId);
        expect(res.body.data.questions).to.equal(qns);
        done();
      });
  });
});

describe('POST User can request mentorship, api/v1/sessions', () => {
  it('request with invalid mentor id', (done) => {
    chai.request(app)
      .post('/api/v1/sessions')
      .send(sessions[2])
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"mentorid" must be a number');
        done();
      });
  });
});

describe('POST User can request mentorship, api/v1/sessions', () => {
  it('request with no mentor id', (done) => {
    chai.request(app)
      .post('/api/v1/sessions')
      .send(sessions[3])
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"mentorid" is required');
        done();
      });
  });
});

describe('POST User can request mentorship, api/v1/sessions', () => {
  it('request with no questions', (done) => {
    chai.request(app)
      .post('/api/v1/sessions')
      .send(sessions[4])
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"questions" is required');
        done();
      });
  });
});