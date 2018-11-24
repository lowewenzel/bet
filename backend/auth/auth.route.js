const express = require('express');
const authController = require('./auth.controller');

const router = express.Router(); // eslint-disable-line new-cap

// GET Routes

router.get('/signup', (req, res) => {
  if (req.cookies.nToken) {
    res.redirect('/'); // Go home if logged in
  } else {
    res.render('signup', { title: 'Signup', message: 'Signup User', error: req.flash('error') });
  }
});

router.get('/login', (req, res) => {
  if (req.cookies.nToken) {
    res.redirect('/'); // Go home if logged in
  } else {
    res.render('login', { title: 'Login', message: 'Login User', error: req.flash('error') });
  }
});

// POST routes

router.post('/auth/new', authController.postNewUser);

router.post('/auth/login', authController.loginUser);

router.get('/auth/logout', authController.logoutUser);
module.exports = router;
