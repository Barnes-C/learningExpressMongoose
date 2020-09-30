const jwt = require('jsonwebtoken');
const HttpStatus = require('./httpStatus');

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.body.token, process.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Auth failed' });
  }
};
