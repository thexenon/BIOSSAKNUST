const mongoose = require('mongoose');

const mainAnonSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'A message must be set'],
      trim: true,
      minlength: [10, 'Message can not be less than 10 characters'],
      maxlength: [600, 'Message can not be more than 600 characters'],
    },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reactions: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    commentors: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    color: {
      type: String,
      required: [true, 'Select a color from the list'],
      default: '#00ff22',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

mainAnonSchema.virtual('comments', {
  ref: 'MainComment',
  foreignField: 'mainmessage',
  localField: '_id',
});

mainAnonSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const MainAnon = mongoose.model('MainAnon', mainAnonSchema);

module.exports = MainAnon;
