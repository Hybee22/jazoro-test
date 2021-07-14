const JWT = require('jsonwebtoken');
const secret = process.env.JAZORO_TEST_ACCESS_TOKEN_SECRET;

module.exports = {
  signAccessToken: (data) => {
    const payload = data;
    const options = {
      expiresIn: process.env.JAZORO_TEST_ACCESS_TOKEN_SECRET_EXPIRES_IN,
      issuer: 'Ibrahim Adekunle',
      audience: '',
    };
    const token = JWT.sign(payload, secret, options);
    return token;
  },
  verifyAccessToken: (token) => {
    const payload = JWT.verify(token, secret);
    // console.log(payload);
    return payload;
  },
};
