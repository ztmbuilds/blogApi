const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
require('dotenv').config({ path: `${process.cwd()}/.env` });

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // the payload(an object containing data),the jwt secret, options.
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true, //Ensures tha the cookie cannot be changed or modified by the browser
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  const newUser = await User.create({
    name: body.name,
    email: body.email,
    role: body.role,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
  });

  if (!newUser) {
    return next(new AppError('Failed to create the user', 400));
  }

  createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
    // return res.status(401).json({
    //   status: 'fail',
    //   message: 'Incorrect email or password',
    // });
  }

  createSendToken(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
  //1) Get token and check if it is there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }

  //2) Verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists

  const freshUser = await User.findByPk(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  //4) Check if user changed password after the token was issued
  if (await freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  } //decoded.iat is the JWTTimestamp

  //Grant access to protected route
  req.user = freshUser; //Put user data on the request
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'store-owner']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      ); //403 : forbidden
    }
    next();
  };
};

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
};
