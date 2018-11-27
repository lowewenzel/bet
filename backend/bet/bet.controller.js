const jwt = require('jsonwebtoken');
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
      res.redirect('/bets/new').send();
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
function getBetsFromDb(callback) {
  Bet.find({})
    .populate('userA')
    .populate('userB')
    .then((bets) => { callback(bets); });
}

function getBetFromDb(id, callback) {
  Bet.findById(id)
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
      getBetsFromDb(bets => res.render('indexFeed', { title: 'Bet. A Social Betting App', message: `Hello ${user.firstName}`, bets, error: req.flash('homeError') }));
    }
  });
};

exports.getBet = function getBet(req, res) {
  if (!req.cookies.nToken) {
    req.flash('homeError', 'You must be logged in to view Bets!');
    res.redirect('/');
  } else {
    getBetFromDb(req.params.id, bet => res.render('betView', { title: `Bet between ${bet.userA.firstName} and ${bet.userB.firstName}`, bet }));
  }
};

exports.getBets = function getBets(req, res) {
  if (!req.cookies.nToken) {
    req.flash('homeError', 'You must be logged in to view Bets!');
    res.redirect('/');
  } else {
    getMyBets(req.user._id, bets => res.render('myBets', { bets }));
  }
};


exports.getUser = function getUser(req, res) {
};

exports.updateUser = function updateUser(req, res) {
};

exports.deleteUser = function deleteUser(req, res) {
};
