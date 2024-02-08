const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../model/userModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED,
  });
};

const createJWT = (user, statusCode, res) => {
  const token = signJWT(user._id);

  const cookieOptions = {
    expries: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      data: user,
    },
  });
};

exports.signUP = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  createJWT(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('please provide email and password', 404));

  const user = await User.findOne({ email }).select('+password');
  console.log(email, password);

  if (!user)
    return next(new AppError('Invalid email! please provide correct one', 404));

  const correctPassword = await user.loginCorrectPasswrd(
    password,
    user.password,
  );

  if (!correctPassword)
    return next(
      new AppError('invalid password! please provide correct one', 404),
    );

  createJWT(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError('you are not logged in. please log in again!...', 401),
    );
  let decode;

  decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const frashUser = await User.findById(decode.id);
  if (!frashUser)
    return next(new AppError('invalid user. please log in again!', 401));

  if (frashUser.passwordChangeAt(decode.iat))
    return next(
      new AppError(
        'you are recently change your password please log in again',
        401,
      ),
    );

  req.user = frashUser;
  res.locals.user = frashUser;
  next();
});

exports.restictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(res.user.role))
      return next(
        new AppError('you do not have permission to perform this action', 403),
      );
    next();
  };
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    //1) verify jwt token

    try {
      const decode = await promisify(jwt.verify)(
        res.cookies.jwt,
        process.env.JWT_SECRET,
      );

      //2) checking user is exist

      const frashUser = await User.findById(decode.id);
      if (!frashUser) return next();

      //3) checking is user change his password
      if (frashUser.passwordChangeAt(decode.iat)) return next();

      //4 Setting user at Browser

      res.locals.user = frashUser;

      return next();
    } catch (err) {
      return next();
    }
  }

  next();
};

exports.allUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) return next(new AppError('Data not found!', 404));

  res.status(200).json({
    status: 'succes',
    data: users,
  });
});
