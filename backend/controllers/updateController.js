const Update = require('../models/updateModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getUpdate = factory.getOne(Update);

exports.createUpdate = catchAsync(async (req, res, next) => {
  const update = await Update.create({
    name: 'App Update Available',
    description: req.body.description,
    isUpdated: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: update,
    },
  });
});

exports.updateUpdate = catchAsync(async (req, res, next) => {
  const update = await Update.findByIdAndUpdate(
    req.params.id,
    {
      description: req.body.description,
      isUpdated: req.body.isUpdated,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!update) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: update,
    },
  });
});
