// TODO: WEB VIEW CONTROLLER
const MainAnon = require('../models/mainAnonModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get mainAnon data from collection
  const mainAnons = await MainAnon.find().populate({
    path: 'comments',
    fields: 'comment',
  });

  // 2) Build template
  // 3) Render that template using mainAnon data from 1)
  res.status(200).render('overview', {
    title: 'All MainAnons',
    mainAnons,
  });
});

exports.getMainAnon = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested mainAnons (including comments and guides)
  const mainAnons = await MainAnon.findOne({ _id: req.params.id }).populate({
    path: 'comments',
    fields: 'comment ',
  });

  if (!mainAnons) {
    return next(
      new AppError('There is no Anonymous Message with that ID.', 404),
    );
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('mainAnons', {
    title: `Anonymous`,
    mainAnons,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      description: req.body.description,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
