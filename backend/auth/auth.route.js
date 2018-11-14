const express = require('express');
const authController = require('./auth.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/new', authController.postNewUser);

// router.post('/check', authController.checkUsername);

router.post('/login', authController.loginUser);

router.post('/logout', authController.logoutUser);
module.exports = router;
