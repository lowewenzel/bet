const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const config = require('../config/config');


// Sign up new users
exports.postNewUser = function postNewUser(req, res) {
  const newUser = new User(req.body);
  newUser.save().then((user) => {
    const token = jwt.sign({ firstName: user.firstName, email: user.email, _id: user._id }, config.jwtSecret, { expiresIn: '1d' });
    res.status(200).cookie('nToken', token).redirect('/');
  }).catch((err) => {
    req.flash('error', err.message);
    res.redirect('/signup');
  });
};

// Login Existing Users
exports.loginUser = function loginUser(req, res) {
  const { email, password } = req.body;

  User.findOne({ email }, 'firstName email password').then((user) => {
    if (!user) {
      // User not found
      req.flash('error', 'User with this email not found');
      res.redirect('/login');
    }
    // Check the password
    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch) {
        // Password does not match
        req.flash('error', 'Wrong Password');
        res.redirect('/login');
      } else {
      // Create a token
        const token = jwt.sign({ firstName: user.firstName, email: user.email, _id: user._id }, config.jwtSecret, { expiresIn: '1d' });
        // Set a cookie and redirect to root
        return res.status(200).cookie('nToken', token).redirect('/');
      }
    });
  }).catch((err) => {
    req.flash('error', err.message);
    res.redirect('/login');
  });
};

// Logout current user
exports.logoutUser = function logoutUser(req, res) {
  res.clearCookie('nToken');
  res.status(200).redirect('/');
};
