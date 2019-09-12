import * as HttpStatus from 'http-status-codes';

import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import users from '../models/users';


const { expect } = chai;

chai.use(chaiHttp);

const { email } = users[0];
// eslint-disable-next-line no-unused-vars
let token;

// ############ SIGNUP TEST ############

describe('POST sign up with whitespaced first_name, api/v2/auth/signup', () => {
  it('should return an error', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(users[10])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('"firstName" must only contain alpha-numeric characters');
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        done();
      });
  });
});

describe('POST sign up with whitespaced last_name, api/v2/auth/signup', () => {
  it('should return an error', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(users[11])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        done();
      });
  });
});

describe('POST sign up with whitespaced password, api/v2/auth/signup', () => {
  it('should return an error', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(users[12])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        done();
      });
  });
});
describe('POST sign up successfully, api/v2/auth/signup', () => {
  it('should return signup successful', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(users[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(HttpStatus.CREATED);
        expect(res.body.status).to.equal(HttpStatus.CREATED);
        expect(res.body.message).to.equal('user created succefully');
        done();
      });
  });
});

describe('POST email already exist, api/v2/auth/signup', () => {
  it('should return {email} already exists', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(users[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(HttpStatus.CONFLICT);
        expect(res.body.error).to.equal(`${email} is already taken!`);
        done();
      });
  });
});

describe('POST sign up with incomplete data api/v2/auth/signup', () => {
  it('should return error when user signup details is incomplete', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(users[3])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('"firstName" is required');
        done();
      });
  });
});

describe('POST sign up with invalid email api/v2/auth/signup', () => {
  it('should return error when user email is invalid', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send(users[2])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('"email" is required');
        done();
      });
  });
});

// ############ SIGNIN TEST ############

describe('POST signin successfully, api/v2/auth/signin', () => {
  it('should return signin successfullty status', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(users[5])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.OK);
        expect(res.body.data.token).to.be.a('string');
        done();
      });
  });
});

describe('POST signin failed, api/v2/auth/signin', () => {
  it('should return signin error status', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(users[6])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.UNAUTHORIZED);
        expect(res.body.error).to.equal('Invalid Email or Password');
        done();
      });
  });
});

describe('POST signin with incomplete data, api/v2/auth/signin', () => {
  it('should return email is required', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .set('Accept', 'application/json')
      .send(users[7])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('"email" is required');
        done();
      });
  });
});

describe('POST signin with incomplete data, api/v2/auth/signin', () => {
  it('should return password is required', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .set('Accept', 'application/json')
      .send(users[8])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('"password" is required');
        done();
      });
  });
});

describe('POST signin with invalid email, api/v2/auth/signin', () => {
  it('should return email must be valid', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .set('Accept', 'application/json')
      .send(users[9])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.error).to.equal('"email" must be a valid email');
        done();
      });
  });
});
