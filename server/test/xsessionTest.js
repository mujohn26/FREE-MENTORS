import * as HttpStatus from 'http-status-codes';
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import users from '../models/users';

import sessions from '../models/sessions';

import generateToken from '../helpers/tokens';

const { expect } = chai;

chai.use(chaiHttp);

// ############ MENTOR TEST ############
const meId = sessions[0].mentorid;
const qns = sessions[0].questions;
const token = generateToken.generateToken(1, users[0].email, false, true);
describe('POST User can request mentorship, api/v1/sessions', () => {
  it('should create a mentorship session successfully', (done) => {
    chai.request(app)
      .post('/api/v1/sessions')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .send(sessions[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.CREATED);
        expect(res.body.message).to.equal('session was created');
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
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .send(sessions[2])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('"mentorid" must be a number');
        done();
      });
  });
});

describe('POST User can request mentorship, api/v1/sessions', () => {
  it('request with no mentor id', (done) => {
    chai.request(app)
      .post('/api/v1/sessions')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .send(sessions[3])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('"mentorid" is required');
        done();
      });
  });
});

describe('POST User can request mentorship, api/v1/sessions', () => {
  it('request with no questions', (done) => {
    chai.request(app)
      .post('/api/v1/sessions')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .send(sessions[4])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('"questions" is required');
        done();
      });
  });
});
