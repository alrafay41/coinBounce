const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const passwordPattern = "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$";

const authController = {
  async login(req, res, next) {},
  async register(req, res, next) {
    //1. validate user

    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required,
      name: Joi.string().max(30).required,
      email: Joi.string().email().required,
      password: Joi.string().pattern(passwordPattern).required,
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);

    //2. if error in valdation --> return error via middleware
    if (error) {
      error.next(); // here we call the middleware
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

    const hashPassword = bcrypt.hash(password, 10);

    //5.save to db

    const newUser = new User({
      email,
      username,
      name,
      password: hashPassword,
    });

    const user = newUser.save();

    //6. send response to client
    return res.status(201).json({ user });
  },
};

module.exports = authController;
