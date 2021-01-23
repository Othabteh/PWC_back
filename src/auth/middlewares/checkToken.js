'use strict';

const users = require('../models/users-model');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    console.log(req.header);
    next('invalid login');
  } else {
    const token = req.headers.authorization.split(' ').pop();
    users
      .authenticateToken(token)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch(() => {
        next('Invalid Login');
      });
  }
};
