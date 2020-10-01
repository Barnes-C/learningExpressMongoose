const jwt = require('jsonwebtoken');
const HttpStatus = require('./httpStatus');
const logger = require('./logger');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    logger.debug(`req.headers.authorization: ${req.headers.authorization}`);
    logger.debug(`token: ${token}`);
    logger.debug(`JWT_KEY: ${process.env.JWT_KEY}`);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    logger.debug(`decoded: ${decoded}`);
    req.userData = decoded;
    logger.debug(`req.userData: ${req.userData}`);
    next();
  } catch (error) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Auth failed in check auth' });
  }
};
