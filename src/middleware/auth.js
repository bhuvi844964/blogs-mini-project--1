const jwt = require('jsonwebtoken');

module.exports.tokenChecker = async function (req, res, next) {
  try {
    const token = req.headers['x-api-key'];

    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: 'Missing authentication token in request ' });
    }

    jwt.verify(token, 'This-is-a-secret-key', function (err, decoded) {
      if (err) {
        return res.status(401).send({ status: false, message: 'Token invalid ' });
      } else {
        req._id = decoded._id;
        return next();
      }
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};