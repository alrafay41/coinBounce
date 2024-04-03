const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const UserDTO = require("../DTOs/user");
const RefreshTokenModel = require("../models/token");
const JWTService = require("../services/JWTservice");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;
    let user;
    try {
      user = await User.findOne({ email: email });
      if (!user) {
        const error = {
          status: 401,
          message: "invalid email",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    // create token and update it to  database everytime user logins
    const accessToken = JWTService.signAccessToken(
      { _id: user._id, email: user.email },
      "30m"
    );
    const refreshToken = JWTService.signRefreshToken(
      { _id: user._id, email: user.email },
      "60m"
    );

    try {
      await RefreshTokenModel.updateOne(
        { _id: user._id },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    //save the new refresh token in the cookies

    res.cookie("AccessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("RefreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
  async register(req, res, next) {
    //1. validate user

    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);

    //2. if error in valdation --> return error via middleware
    if (error) {
      return next(error); // here we call the middleware
    }

    // 3. if email and username already exist, return error

    const { name, email, username, password } = req.body;

    // as we are going to communicate with database, so we will use try catch.
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already Exists",
        };

        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username already Exists",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //4.hash password

    const hashPassword = await bcrypt.hash(password, 10);

    //5.save to db
    let accessToken;
    let refreshToken;
    let user;

    try {
      const newUser = new User({
        email,
        username,
        name,
        password: hashPassword,
      });

      user = await newUser.save();

      //create token from service

      accessToken = JWTService.signAccessToken(
        { _id: user._id, email: user.email },
        "30m"
      );
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

      //save token in db

      await JWTService.storeRefreshToken(refreshToken, user._id);
    } catch (error) {
      return next(error);
    }

    // save token in cookies

    res.cookie("AccessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("RefreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    const userDto = new UserDTO(user);

    //6. send response to client
    return res.status(201).json({ user: userDto, auth: true });
  },

  async logout(req, res, next) {
    const { RefreshToken } = req.cookies;
    // delete token from db

    try {
      await RefreshTokenModel.deleteOne({ token: RefreshToken });
    } catch (error) {
      return next(error);
    }

    // delete it from cookies
    res.clearCookie("AccessToken");
    res.clearCookie("RefreshToken");

    return res.status(200).json({ user: null, auth: false });
  },

  async refresh(req, res, next) {
    //1. get refresh token
    //2. verify refresh token
    //3. generate new token
    //4. update db, return response

    const originalRefreshToken = req.cookies.RefreshToken; // we could have destructered it but we need to use that refreshToken name again.
    // we verify it using jwtservice, and we will be getting id if there's a token same as in cookies

    let id;

    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: "401",
        message: "Unauthorized",
      };
      return next(error);
    }

    try {
      const match = RefreshTokenModel.findOne({
        _id: id,
        token: originalRefreshToken,
      });
      if (!match) {
        const error = {
          status: "401",
          message: "unauthorized",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    try {
      const AccessToken = JWTService.signAccessToken({ _id: id }, "30m");
      const RefreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshTokenModel.updateOne({ _id: id }, { token: RefreshToken });

      res.cookie("AccessToken", AccessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie("RefreshToken", RefreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (error) {
      return next(error);
    }

    const user = await User.findOne({ _id: id });
    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = authController;
