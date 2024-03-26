const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../config/index");
const RefreshToken = require("../models/token");

class JWTService {
  // the main difference between access and refresh token is that access token has a less expiry time as compared to refresh token. the secret key of both of them could be same,
  // but the best practice is to keep them dfferent

  static signAccessToken(payload, time, secret = ACCESS_TOKEN_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: time });
  }

  static signRefreshToken(payload, time, secret = REFRESH_TOKEN_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: time });
  }

  // we make all the methods static so that when we import it and use it in a file, we don't have to make a new object
  static verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }

  static async storeRefreshToken(token, userId) {
    try {
      const newToken = new RefreshToken({ token: token, userId: userId });
      await newToken.save();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = JWTService;
