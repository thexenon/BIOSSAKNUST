const YearAnon = require('./../models/yearAnonModel');
const factory = require('./handlerFactory');

exports.setUserIds = (req, res, next) => {
  if (!req.body.sender) req.body.sender = req.user.id;
  if (!req.body.year) req.body.year = req.user.year;
  next();
};

exports.deleteYearAnon = factory.deleteOne(YearAnon);
exports.getAllYearAnons = factory.getAll(YearAnon, { path: 'comments' });
exports.getSingleYearAnon = factory.getOne(YearAnon, { path: 'comments' });
exports.addNewYearAnon = factory.createOne(YearAnon);
exports.updateYearAnon = factory.updateOne(YearAnon);
exports.updateYearAnonReaction = factory.updateArray(YearAnon);
