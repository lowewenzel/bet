const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('./user.model');

exports.getUsers = function getUsers(req, res) {
  // if (req.user.username === req.params.username) {
  //   User.find({}, 'username igUsername fbUsername twUsername scUsername')
  //     .then((users) => {
  //       res.status(200).json(users).send();
  //     })
  //     .catch((err) => {
  //       res.status(400).json({ message: err.message });
  //     });
  // } else {
  //   res.status(401).json({ message: 'Error: You must be logged in to view all users.' });
  // }
};

exports.getOneUser = function getOneUser(req, res) {
  // User.findOne({ username: req.params.username }, 'username igUsername fbUsername twUsername scUsername')
  //   .then((user) => {
  //     res.status(200).json(user).send();
  //   })
  //   .catch((err) => {
  //     res.status(400).json({ message: err.message });
  //   });
};

exports.updateUser = function updateUser(req, res) {
  // if (req.user.username === req.params.username) {
  //   User.findOneAndUpdate({ username: req.params.username }, {$set: req.body}, { new: true, runValidators: true, context: 'query' })
  //     .then((user) => {
  //       res.status(200).json(user).send();
  //     })
  //     .catch((err) => {
  //       res.status(400).json({ message: err.message });
  //     });
  // } else {
  //   res.status(401).json({ message: 'Error: You are not logged in as this user!' });
  // }
};

exports.deleteUser = function deleteUser(req, res) {
  // if (req.user.username === req.params.username) {
  //   User.findOneAndRemove({ username: req.params.username })
  //     .then((user) => {
  //       res.status(200).json({ message: `user ${user.username} removed!` }).send();
  //     })
  //     .catch((err) => {
  //       res.status(400).json({ message: err.message });
  //     });
  // } else {
  //   res.status(401).json({ message: 'Error: You are not logged in as this user!' });
  // }
};
