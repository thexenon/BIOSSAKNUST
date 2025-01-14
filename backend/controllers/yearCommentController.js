const YearComment = require('./../models/yearCommentModel');
const factory = require('./handlerFactory');

exports.setYearAnonUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.yearmessage) req.body.yearmessage = req.params.yearAnonId;
  if (!req.body.sender) req.body.sender = req.user.id;
  next();
};

exports.getAllYearComments = factory.getAll(YearComment);
exports.getYearComment = factory.getOne(YearComment);
exports.createYearComment = factory.createOne(YearComment);
exports.updateYearComment = factory.updateOne(YearComment);
exports.deleteYearComment = factory.deleteOne(YearComment);
