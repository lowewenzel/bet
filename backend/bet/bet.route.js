const express = require('express');
const jwt = require('jsonwebtoken');
const betController = require('./bet.controller');
const config = require('../config/config');


const router = express.Router(); // eslint-disable-line new-cap

// Must be authenticated
const checkAuthentication = (req, res, next) => {
  if (!req.cookies.nToken) {
    req.flash('homeError', 'You must be logged in!');
    res.redirect('/');
  } else {
    const { nToken } = req.cookies;
    const decodedToken = jwt.verify(nToken, config.jwtSecret, (err, decoded) => {
      if (err) {
        req.flash('homeError', err.message);
        res.redirect(307, '/');
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

router.get('/', (req, res, next) => {
  if (!req.cookies.nToken) {
    res.render('index', {title: 'Bet. A Social Betting App', error: req.flash('homeError'), notLoggedIn: true });
  } else {
    next();
  }
}, checkAuthentication, betController.getIndex);

router.get('/bets/new', (req, res) => {
  if (!req.cookies.nToken) {
    res.redirect('/');
  } else {
    res.render('newBet', { error: req.flash('newBetError') });
  }
});

router.post('/bets/new', checkAuthentication, betController.postNewBet);

router.get('/bets', checkAuthentication, betController.getBets);

router.get('/bet/:id', checkAuthentication, betController.getBet);

router.get('/bet/:id/complete', checkAuthentication, betController.getCompleteBet);

router.post('/bet/:id/complete', checkAuthentication, betController.postCompleteStageOne);

// router.get('/:username', userController.getOneUser);

// router.patch('/:username', checkAuthentication, userController.updateUser);

// router.post('/:username/delete', checkAuthentication, userController.deleteUser);

module.exports = router;
