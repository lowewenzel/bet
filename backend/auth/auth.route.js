const express = require('express');
const { body } = require('express-validator');
const authController = require('./auth.controller');

const router = express.Router(); // eslint-disable-line new-cap

// GET Routes

router.get('/signup', (req, res) => {
  if (req.cookies.nToken) {
    res.redirect('/'); // Go home if logged in
  } else {
    res.render('signup', {
      title: 'Signup',
      error: req.flash('error'),
      notLoggedIn: true
    });
  }
});

router.get('/login', (req, res) => {
  if (req.cookies.nToken) {
    res.redirect('/'); // Go home if logged in
  } else {
    res.render('login', {
      title: 'Login',
      error: req.flash('error'),
      notLoggedIn: true
    });
  }
});

// POST routes

router.post(
  '/auth/new',
  [
    body('email')
      .isEmail()
      .normalizeEmail(),
    body('password').isLength({ min: 6, max: 24 }),
    body('firstName').isLength({ max: 24 }),
    body('lastName').isLength({ max: 24 })
  ],
  authController.postNewUser
);

router.post(
  '/auth/login',
  [body('email').isEmail(), body('password').isLength({ min: 6, max: 24 })],
  authController.loginUser
);

router.get('/auth/logout', authController.logoutUser);
module.exports = router;
