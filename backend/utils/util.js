const jwt = require('jsonwebtoken')
require('dotenv').config();
module.exports = {
  createAccessToken(user) {
    return jwt.sign(
      payload=user, 
      process.env.ACCESS_TOKEN_SECRET, 
      {
       expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
      }
    );
  },
  //*Create RefreshToken
  createRefreshToken(user) {
    return jwt.sign(payload=user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.EXPIRES_REFRESH_TOKEN,
    });
  },

}