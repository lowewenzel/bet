const chai = require('chai'); // eslint-disable-line import/newline-after-import
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

const agent = chai.request.agent(server);

const User = require('./user.model');

chai.config.includeStack = true;

describe('## User Model Tests', () => {

  it('should fail getting users (not admin)', (done) => {
    User.findOneAndRemove({ username: 'testunauthorized' }, () => {
      agent
        .post('/auth/new')
        .send({
          username: 'testunauthorized',
          password: 'asdf',
        })
        .end(() => {
          agent
            .get('/users')
            .end((req, res) => {
              res.status.should.be.equal(403);
              done();
            });
        });
    });
  });

  it('should successfuly update a user', (done) => {
    // Flow: create a updatable user, login to authorized admin, update user username
    User.findOneAndRemove({ username: 'testupdatable' }, () => {
      agent
        .post('/auth/new')
        .send({
          username: 'testupdatable',
          password: 'red',
          fbUsername: 'updateme',
        })
        .end(() => {
          helperAdmin(() => {
            agent
              .put('/users/testupdatable')
              .send({
                fbUsername: 'wowimnew',
              })
              .end((req, res) => {
                User.findOne({ username: 'testupdatable' }, 'fbUsername', (err, updatedUser) => {
                  expect(updatedUser.fbUsername).to.equal('wowimnew');
                  res.status.should.be.equal(200);
                  done();
                });
              });
          });
        });
    });
  });

  it('should successfuly delete a user', (done) => {
    agent
      .post('/auth/new')
      .send({
        username: 'deleteme',
        password: 'red',
      })
      .end(() => {
        helperAdmin(() => {
          agent
            .delete('/users/deleteme')
            .end((req, res) => {
              User.findOne({ username: 'deleteme' }, (err, deletedUser) => {
                expect(deletedUser).to.equal(null);
                res.status.should.be.equal(200);
                done();
              });
            });
        });
      });
  });
});
