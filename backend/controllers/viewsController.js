// // TODO: WEB VIEW CONTROLLER
// const Scripture = require('../models/scriptureModel');
// const User = require('../models/userModel');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// exports.getOverview = catchAsync(async (req, res, next) => {
//   // 1) Get scripture data from collection
//   const scriptures = await Scripture.find().populate({
//     path: 'comments',
//     fields: 'comment user',
//   });

//   // 2) Build template
//   // 3) Render that template using scripture data from 1)
//   res.status(200).render('overview', {
//     title: 'All Scriptures',
//     scriptures,
//   });
// });

// exports.getScripture = catchAsync(async (req, res, next) => {
//   // 1) Get the data, for the requested scripture (including comments and guides)
//   const scripture = await Scripture.findOne({ _id: req.params.id }).populate({
//     path: 'comments',
//     fields: 'comment user',
//   });

//   if (!scripture) {
//     return next(new AppError('There is no scripture with that ID.', 404));
//   }

//   // 2) Build template
//   // 3) Render template using data from 1)
//   res.status(200).render('scripture', {
//     title: `${scripture.title} Scripture`,
//     scripture,
//   });
// });

// exports.getLoginForm = (req, res) => {
//   res.status(200).render('login', {
//     title: 'Log into your account',
//   });
// };

// exports.postImageForm = (req, res) => {
//   res.status(200).render('post-image', {
//     resnonce: res.locals.nonce,
//   });
// };

// exports.postVideoForm = (req, res) => {
//   res.status(200).render('post-video', {
//     resnonce: res.locals.nonce,
//   });
// };

// exports.getAccount = (req, res) => {
//   res.status(200).render('account', {
//     title: 'Your account',
//   });
// };

// exports.getStream = (req, res) => {
//   res.status(200).render('stream', {
//     title: 'Live Streaming',
//   });
// };

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//       description: req.body.description,
//     },
//     {
//       new: true,
//       runValidators: true,
//     },
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser,
//   });
// });
