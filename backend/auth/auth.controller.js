const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const config = require('../config/config');


// Sign up new users
exports.postNewUser = function postNewUser(req, res) {
  // const newUser = new User(req.body);
  // newUser.save().then((user) => {
  //   const token = jwt.sign({ username: user.username, _id: user._id }, config.jwtSecret, { expiresIn: '1d' });
  //   res.status(200)
  //     .json({ message: 'User added!', token: token, username: user.username });
  // }).catch((err) => {
  //   res.status(400).json(err.message);
  // });
};

// Login Existing Users
exports.loginUser = function loginUser(req, res) {
  // const { username, password } = req.body;

  // User.findOne({ username }, 'username password').then((user) => {
  //   if (!user) {
  //     // User not found
  //     return res.status(401).json({ message: 'Wrong Username or Password' });
  //   }
  //   // Check the password
  //   user.comparePassword(password, (err, isMatch) => {
  //     if (!isMatch) {
  //       // Password does not match
  //       return res.status(401).json({ message: 'Wrong Username or Password' });
  //     }
  //     // Create a token
  //     const token = jwt.sign({ username: user.username, _id: user._id }, config.jwtSecret, { expiresIn: '1d' });
  //     // Set a cookie and redirect to root
  //     return res.status(200).json({
  //       token,
  //       username: user.username,
  //     }).send();
  //   });
  // }).catch((err) => {
  //   res.json(err.message);
  // });
};

// Logout current user
exports.logoutUser = function logoutUser(req, res) {
  // res.clearCookie('nToken');
  // res.status(200).send();
};
