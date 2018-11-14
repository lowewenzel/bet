const chai = require('chai'); // eslint-disable-line import/newline-after-import
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

const agent = chai.request.agent(server);

const User = require('./user.model');

chai.config.includeStack = true;

const helperAdmin = function helperAdmin(callback) {
  agent
    .post('/auth/login')
    .send({
      username: 'testauthorized',
      password: 'asdf',
    })
    .end((req, res) => {
      callback(req, res);
    });
};

describe('## User Model Tests', () => {
  it('should fail getting users (not logged in)', (done) => {
    agent
      .post('/auth/logout')
      .end(() => {
        agent
          .get('/users/')
          .end((req, res) => {
            res.status.should.be.equal(401);
            done();
          });
      });
  });

  // it('should fail getting users (not admin)', (done) => {
  //   User.findOneAndRemove({ username: 'testunauthorized' }, () => {
  //     agent
  //       .post('/auth/new')
  //       .send({
  //         username: 'testunauthorized',
  //         password: 'asdf',
  //         fbUsername: 'really', // facebook
  //         igUsername: 'cool', // instagram
  //         twUsername: 'story', // twitter
  //         scUsername: 'bro', // snapchat
  //       })
  //       .end(() => {
  //         agent
  //           .get('/users')
  //           .end((req, res) => {
  //             res.status.should.be.equal(403);
  //             done();
  //           });
  //       });
  //   });
  // });

  it('should successfuly get all users', (done) => {
    User.findOneAndRemove({ username: 'testauthorized' }, () => {
      agent
        .post('/auth/new')
        .send({
          username: 'testauthorized',
          password: 'asdf',
          fbUsername: 'i', // facebook
          igUsername: 'live', // instagram
          twUsername: 'on', // twitter
          scUsername: 'coffee', // snapchat
          isAdmin: true,
        })
        .end(() => {
          agent
            .get('/users')
            .end((req, res) => {
              res.status.should.be.equal(200);
              done();
            });
        });
    });
  });

  // Read User object as admin
  it('should successfuly read a user', (done) => {
    User.findOneAndRemove({ username: 'testread' }, () => {
      agent
        .post('/auth/new')
        .send({
          username: 'testread',
          password: 'asdf',
          fbUsername: 'asf', // facebook
          igUsername: 'live', // instagram
          twUsername: 'on', // twitter
          scUsername: 'coffee', // snapchat
        })
        .end(() => {
          agent
            .post('/auth/logout')
            .end(() => {
              // Login as Admin
              helperAdmin(() => {
                agent
                  .get('/users/testread')
                  .end((req, res) => {
                    res.status.should.be.equal(200);
                    done();
                  });
              });
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
