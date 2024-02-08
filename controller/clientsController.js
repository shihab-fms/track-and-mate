const jwt = require('jsonwebtoken');

const Clients = require('../model/cleintModel');

const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const { set } = require('mongoose');
const cleints = require('../model/cleintModel');

const clientSignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_CLIENT,
  });
};

const createJWT = (user, statusCode, res) => {
  const token = clientSignToken(user._id);

  const cookieOptions = {
    expries: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED_CLIENT * 24 * 60 * 60 * 1000,
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
exports.CreateClinets = catchAsync(async (req, res, next) => {
  const client = await Clients.create(req.body);
  if (!cleints) return next(new AppError('client not created!', 404));

  res.status(201).json({
    status: 'success',
    data: client,
  });
});

exports.updateClinet = catchAsync(async (req, res, next) => {
  const client = Clients.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!client) return next(new AppError('client not found!', 404));

  req.status(203).json({
    status: 'success',
    result: client,
  });
});

exports.getClient = catchAsync(async (req, res, next) => {
  const client = await Clients.findById(req.params.id);

  if (!client) return next(new AppError('Client not found!', 404));
  res.status(200).json({
    status: 'success',
    result: client,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const clients = await Clients.find();
  if (!clients) return next(new AppError('No clients found!', 404));
  res.status(200).json({
    status: 'success',
    result: clients.length,
    data: clients,
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const client = await Clients.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success', 
  })
});
