
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
