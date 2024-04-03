const JWTService = require("../services/JWTservice");
const User = require("../models/user");
const UserDTO = require("../DTOs/user");

const auth = async (req, res, next) => {
  // 1. refresh,access token validation

  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    const error = {
      status: 401,
      message: "Unauthorized",
    };
    return next(error);
  }

  let _id;
  try {
    _id = JWTService.verifyAccessToken[accessToken]._id;
  } catch (error) {
    return next(error);
  }
  // now we will find the user based on the id. and for that we need to import user model and user dto
  let user;

  try {
    user = await User.findOne({ _id: _id });
  } catch (error) {
    return next(error);
  }

  const userDto = new UserDTO({ user });
  req.user = userDto;
};

module.exports = auth;

// now as we know, middleware runs between the request and response, so we will call it in the routes --> index.js file
