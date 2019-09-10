import * as HttpStatus from 'http-status-codes';
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import users from '../controllers/userController';

import generateToken from '../helpers/tokens';

const { expect } = chai;

chai.use(chaiHttp);

// ############ MENTOR TEST ############
// Create a true token for testing
const token = generateToken.generateToken(1, users.email, false, true);
// Create a token with invalid user
const Invalidtoken = generateToken.generateToken(1, 'kkjkshj@gmail.com', false, true);

describe('GET Both Admin and Users can see all mentors, api/v2/mentors', () => {
  it('should return all mentors', (done) => {
    chai.request(app)
      .get('/api/v2/mentors')
      .set('x-auth-token', token)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.OK);
        expect(res.status).to.equal(HttpStatus.OK);
        done();
      });
  });
});


describe('GET View a specific mentor api/v2/mentors/{mentor_Id}', () => {
  it('should return a specific mentor', (done) => {
    chai.request(app)
      .get('/api/v2/mentors/1')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.OK);
        expect(res.body.data.id).to.equal(1);
        expect(res.body.data.firstName).to.equal('murengezi');
        expect(res.body.data.lastName).to.equal('aime');
        expect(res.status).to.equal(HttpStatus.OK);
        done();
      });
  });
});

describe('GET View specifc mentor with an id not an integer', () => {
  it('should return an error', (done) => {
    chai.request(app)
      .get('/api/v2/mentors/k')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('Mentor id should be integer');
        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);
        done();
      });
  });
});

describe('GET view specific , api/v2/mentors', () => {
  it('should return an error', (done) => {
    chai.request(app)
      .get('/api/v2/mentors/9000')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.NOT_FOUND);
        expect(res.body.error).to.equal('No mentors available with that Id');
        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
        done();
      });
  });
});

describe('GET user with invalid token, api/v2/mentors', () => {
  it('should return all mentors', (done) => {
    chai.request(app)
      .get('/api/v2/mentors')
      .set('x-auth-token', Invalidtoken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.UNAUTHORIZED);
        expect(res.body.error).to.equal('You are not a user');
        done();
      });
  });
});
