const chai = require('chai'); // eslint-disable-line import/newline-after-import
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

const agent = chai.request.agent(server);

const User = require('../user/user.model');

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  // # TODO: Implement Authentication Tests.
  it('should signup a new user', (done) => {
    User.findOneAndRemove({ email: 'test@gmail.com' }, () => {
      agent
        .post('/auth/new')
        .send({
          email: 'test@gmail.com',
          password: 'test',
          firstName: 'Tester',
          lastName: 'Show'
        })
        .end((req, res) => {
          res.status.should.be.equal(200);
          expect(res).to.have.cookie('nToken');
          done();
        });
    });
  });
});
