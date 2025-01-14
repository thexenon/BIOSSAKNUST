const MainComment = require('./../models/mainCommentModel');
const factory = require('./handlerFactory');

exports.setMainAnonUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.mainmessage) req.body.mainmessage = req.params.mainAnonId;
  if (!req.body.sender) req.body.sender = req.user.id;
  next();
};

exports.getAllMainComments = factory.getAll(MainComment);
exports.getMainComment = factory.getOne(MainComment);
exports.createMainComment = factory.createOne(MainComment);
exports.updateMainComment = factory.updateOne(MainComment);
exports.deleteMainComment = factory.deleteOne(MainComment);
