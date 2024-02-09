const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

exports.regClient = (req, res, next) => {
  res.status(200).render('clients', {
    title: 'client',
  });
};

exports.returnClient = (req, res, next) => {
  res.status(200).render('thanks', {
    title: '❌thanks',
  });
};
