const Joi = require("joi");
const { ValidationError } = Joi;

const errorHandler = (error, req, res, next) => {
  let status = 500;
  let data = { message: "internal server error" };

  if (error instanceof ValidationError) {
    status = 401;
    data.message = error.message;
    return res.status(status).json(data);
  }

  if (error.status) {
    status = error.status;
  }

  if (error.message) {
    data.message = error.message;
  }

  return res.status(status).json(data);
};

module.exports = errorHandler;
