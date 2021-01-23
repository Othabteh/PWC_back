const base64 = require('base-64');
const users = require('../models/users-model');
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    const basicAuth = req.headers.authorization.split(' ').pop();
    const [user, pass] = base64.decode(basicAuth).split(':');

    return users
      .authenticateBasic(user, pass)
      .then(async (validUser) => {
        req.token = await users.generateToken(validUser[0]);
        req.user = validUser;
        next();
      })
      .catch((err) => next('Invalid Login'));
  }
};
