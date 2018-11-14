const express = require('express');
const jwt = require('jsonwebtoken');
const userController = require('./user.controller');
const config = require('../config/config');


const router = express.Router(); // eslint-disable-line new-cap

// Must be authenticated
const checkAuthentication = (req, res, next) => {
  console.log(req.body)
  if (req.body.token === null) {
    req.user = null;
    // res.status(401).json({ message: 'Error: Signed out' }).send();
    next();
  } else {
    const { token } = req.body;
    const decodedToken = jwt.verify(token, config.jwtSecret, (err, decoded) => {
      req.user = decoded;
      next();
    })
    
  }
};

router.get('/', userController.getUsers);

router.get('/:username', userController.getOneUser);

router.patch('/:username', checkAuthentication, userController.updateUser);

router.post('/:username/delete', checkAuthentication, userController.deleteUser);

module.exports = router;
