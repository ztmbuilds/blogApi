const AppError = require('../utils/appError');

const validate = (schema) => async (req, res, next) => {
  try {
    const { body } = req;
    console.log(body);
    await schema.validate(body);
    next();
  } catch (err) {
    // const message =
    //   err.details && err.details[0] ? err.details[0].message : 'Invalid input';
    // next(new AppError(message, 406));
    next(err);
  }
};

module.exports = validate;
