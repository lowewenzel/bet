const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../user/user.model');
const Bet = require('./bet.model');


/*  (C)reate Bet
**
*/
exports.postNewBet = function postNewBet(req, res) {
  const { betDescription, betValue, emailUserB } = req.body;
  User.findOne({ email: emailUserB }).orFail(new Error('User not found'))
    .catch((err) => {
      req.flash('newBetError', err.message);
      res.redirect(`/bets/new`).send();
    })
    .then((user) => {
      User.findById(req.user._id).orFail(new Error('You must be logged in!'))
        .catch((err) => {
          req.flash('error', err.message);
          res.redirect('/').send();
        })
        .then((origUser) => {
          const newBet = new Bet({
            betDescription, betValue, userA: origUser, userB: user
          });

          // Save bet to user objects
          origUser.bets.unshift(newBet);
          user.bets.unshift(newBet);
          origUser.save();
          user.save();

          newBet.save()
            .then((bet) => {
              res.status(200).redirect(`/bet/${bet._id}`);
            })
            .catch((err) => {
              req.flash('newBetError', err.message);
              res.redirect('/bets/new');
            });
        });
    });
};


/* (R)ead Bet
**
*/
function getBetsFromDb(callback, limit = null) {
  if (limit) {
    Bet.find({})
      .populate('userA')
      .populate('userB')
      .sort({ createdAt: -1 })
      .limit(limit)
      .then((bets) => { callback(bets); });
  } else {
    Bet.find({})
      .populate('userA')
      .populate('userB')
      .sort({ createdAt: -1 })
      .then((bets) => { callback(bets); });
  }
}

function getBetFromDb(id, callback) {
  const strId = `${id}`;
  Bet.findById(strId)
    .populate('userA')
    .populate('userB')
    .then(
      bet => callback(bet)
    );
}

function getMyBets(_id, callback) {
  User.findById(_id, 'bets')
    .populate({
      path: 'bets',
      populate: {
        path: 'userA'
      }
    })
    .populate({
      path: 'bets',
      populate: {
        path: 'userB'
      }
    })
    .sort({ createdAt: -1 })
    .then(
      bets => callback(bets.bets)
    );
}

exports.getIndex = function getIndex(req, res) {
  const { nToken } = req.cookies;
  const decodedToken = jwt.verify(nToken, config.jwtSecret, (err, decoded) => {
    if (err) {
      res.redirect('/auth/logout');
    } else {
      const user = decoded;
      getBetsFromDb((bets) => {
        bets.forEach((bet) => { bet.date = moment(bet.createdAt).calendar(); bet.isLoggedInUser = (bet.userA.email === req.user.email || bet.userB.email === req.user.email); bet.currentUserCompletedBet = (bet.completionProgress.firstMarker === req.user.email) });
        res.render('indexFeed', {
          title: 'Bet. A Social Betting App', user, bets: bets, error: req.flash('homeError')
        });
      }, 3);
    }
  });
};

exports.getBets = function getBets(req, res) {
  if (!req.cookies.nToken) {
    req.flash('homeError', 'You must be logged in to view Bets!');
    res.redirect('/');
  } else {
    getMyBets(req.user._id, bets => res.render('myBets', { bets, user: req.user }));
  }
};

exports.getBet = function getBet(req, res) {
  if (!req.cookies.nToken) {
    req.flash('homeError', 'You must be logged in to view Bets!');
    res.redirect('/');
  } else {
    getBetFromDb(req.params.id, (bet) => {
      const firstMarker = bet.completionProgress.firstMarker;
      let currentUserCompletedBet = false;
      if (firstMarker === req.user.email){
        currentUserCompletedBet = true;
      }
      res.render('betView', {
        title: `Bet between ${bet.userA.firstName} and ${bet.userB.firstName}`,
        bet,
        error: req.flash('betError'),
        message: req.flash('message'),
        currentUserCompletedBet,
        isLoggedInUser: (bet.userA.email === req.user.email || bet.userB.email === req.user.email)
      });
    });
  }
};

exports.getCompleteBet = function getCompleteBet(req, res) {
  if (!req.cookies.nToken) {
    req.flash('homeError', 'You must be logged in to view Bets!');
    res.redirect('/');
  } else {
    getBetFromDb(req.params.id, (bet) => {
      const firstMarker = bet.completionProgress.firstMarker;
      if (firstMarker === req.user.email){
        req.flash('betError', 'Error: You already completed this bet!');
        res.redirect(`/bet/${req.params.id}`);
      } else {
        if (bet.userA.id === req.user._id || bet.userB.id === req.user._id) {
          res.render('completeView', { bet });
        } else {
          req.flash('betError', 'Authentication error: This is not your bet!');
          res.redirect(`/bet/${req.params.id}`);
        }
      }
    });
  }
};


exports.postCompleteStageOne = function postCompleteStageOne(req, res) {
  getBetFromDb(req.params.id, async (bet) => {
    if (bet.userA.id === req.user._id || bet.userB.id === req.user._id) {
      switch (bet.completionProgress.stage) {
        case 0:
          try {
            const winner = await User.findById(req.body.winner);
            bet.completionProgress = {
              stage: 1,
              winner,
              firstMarker: req.user.email
            };
            await bet.save();
            req.flash('message', 'You marked this bet completed! The other user now needs to complete the bet to verify who won.');
          } catch (err) {
            req.flash('betError', `Error choosing winner: ${err.message}`);
          }
          break;
        case 1:
          if (req.user.email === bet.completionProgress.firstMarker) {
            req.flash('betError', 'You already marked this bet complete!');
          } else {
            try {
              const winner = await User.findById(req.body.winner);
              if (bet.completionProgress.winner.email === winner.email) {
                bet.completionProgress = {
                  stage: 2,
                  winner
                };
                req.flash('message', 'Your bet is now complete!');
              } else {
                bet.completionProgress = {
                  stage: 0,
                  winner: null
                };
                req.flash('message', 'Oh no! You both chose different winners. Resolve it by texting them, talking it out over coffee, or other means of convincing!');
              }
              await bet.save();
            } catch (err) {
              req.flash('betError', `Error choosing winner: ${err.message}`);
            }
          }
          break;
        case 2:
          req.flash('betError', 'Error: This bet is already completed!');
          break;
        default:
          req.flash('betError', 'Error 24579485734: An Unknown Error occured');
          break;
      }
      res.redirect(`/bet/${req.params.id}`);
    } else {
      req.flash('betError', 'Authentication error: This is not your bet!');
      res.redirect(`/bet/${req.params.id}`);
    }
  });
};


exports.getUser = function getUser(req, res) {
};

exports.updateUser = function updateUser(req, res) {
};

exports.deleteUser = function deleteUser(req, res) {
};
