const express = require('express');
const authRoutes = require('./auth/auth.route');
const userRoutes = require('./user/user.route');

const router = express.Router(); // eslint-disable-line new-cap

// #TODO: Change to your model.
router.use('/auth', authRoutes);
router.use('/users', userRoutes);


module.exports = router;
