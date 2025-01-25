const MainAnon = require('../models/mainAnonModel');
const factory = require('./handlerFactory');

exports.setUserIds = (req, res, next) => {
  if (!req.body.sender) req.body.sender = req.user.id;
  next();
};

exports.deleteMainAnon = factory.deleteOne(MainAnon);
exports.getAllMainAnons = factory.getAll(MainAnon, { path: 'comments' });
exports.getSingleMainAnon = factory.getOne(MainAnon, { path: 'comments' });
exports.addNewMainAnon = factory.createOne(MainAnon);
exports.updateMainAnon = factory.updateOne(MainAnon);
exports.updateMainAnonReaction = factory.updateArray(MainAnon);
