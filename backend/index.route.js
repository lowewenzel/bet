const express = require('express');
const authRoutes = require('./auth/auth.route');
const userRoutes = require('./user/user.route');
const betController = require('./bet/bet.controller');
const betRoutes = require('./bet/bet.route');
const config = require('./config/config');

const router = express.Router(); // eslint-disable-line new-cap


// Checks if logged in, if logged in, return home feed
router.get('/', (req, res, next) => {
  if (!req.cookies.nToken) {
    res.render('index', { title: 'Bet. A Social Betting App', message: 'Welcome to Bet.', error: req.flash('homeError') });
  } else {
    next();
  }
}, betController.getIndex);

// Signup and Login Routes (C User)
router.use(authRoutes);

// Profile routes (RUD User)
router.use(userRoutes);

// Bet routes (CRUD Bet)
router.use(betRoutes)

module.exports = router;
