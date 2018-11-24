const express = require('express');
const jwt = require('jsonwebtoken');
const authRoutes = require('./auth/auth.route');
const userRoutes = require('./user/user.route');
const config = require('./config/config');

const router = express.Router(); // eslint-disable-line new-cap


// Checks if logged in, if logged in, return home feed
router.get('/', (req, res) => {
  if (!req.cookies.nToken) {
    res.render('index', { title: 'Bet. A Social Betting App', message: 'Welcome to Bet.' });
  } else {
    const { nToken } = req.cookies;
    const decodedToken = jwt.verify(nToken, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.redirect('/auth/logout');
      } else {
        const user = decoded;
        res.render('indexFeed', { title: 'Bet. A Social Betting App', message: `Hello ${user.firstName}` });
      }
    });
  }
});

// Signup and Login Routes
router.use('/', authRoutes);


router.use('/', userRoutes);


module.exports = router;
