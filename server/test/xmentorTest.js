
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import users from '../models/users';

import status from '../helpers/StatusCode';

import generateToken from '../helpers/tokens';

const { expect } = chai;

chai.use(chaiHttp);

// ############ MENTOR TEST ############
// Create a true token for testing
const token = generateToken.generateToken(1, users[0].email, false, true);
// Create a token with invalid user
const Invalidtoken = generateToken.generateToken(1, 'kkjkshj@gmail.com', false, true);

describe('GET Both Admin and Users can see all mentors, api/v1/mentors', () => {
  it('should return all mentors', (done) => {
    chai.request(app)
      .get('/api/v1/mentors')
      .set('x-auth-token', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.data[0].id).to.equal(1);
        expect(res.body.data[0].firstName).to.equal('murengezi');
        expect(res.body.data[0].lastName).to.equal('aime');
        expect(res.body.data[0].is_Mentor).to.equal(true);
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        done();
      });
  });
});


describe('GET View a specific mentor api/v1/mentors/{mentor_Id}', () => {
  it('should return a specific mentor', (done) => {
    chai.request(app)
      .get('/api/v1/mentors/1')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body.data.id).to.equal(1);
        expect(res.body.data.firstName).to.equal('murengezi');
        expect(res.body.data.lastName).to.equal('aime');
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        done();
      });
  });
});

describe('GET View specifc mentor with an id not an integer', () => {
  it('should return an error', (done) => {
    chai.request(app)
      .get('/api/v1/mentors/k')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.BAD_REQUEST);
        expect(res.body.message).to.equal('Mentor id should be integer');
        expect(res.status).to.equal(status.BAD_REQUEST);
        done();
      });
  });
});

describe('GET view specific , api/v1/mentors', () => {
  it('should return an error', (done) => {
    chai.request(app)
      .get('/api/v1/mentors/9000')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.NOT_FOUND);
        expect(res.body.message).to.equal('No mentors available with that Id');
        expect(res.status).to.equal(status.NOT_FOUND);
        done();
      });
  });
});

describe('GET user with invalid token, api/v1/mentors', () => {
  it('should return all mentors', (done) => {
    chai.request(app)
      .get('/api/v1/mentors')
      .set('x-auth-token', Invalidtoken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(status.UNAUTHORIZED);
        expect(res.body.message).to.equal('You are not a user');
        done();
      });
  });
});
