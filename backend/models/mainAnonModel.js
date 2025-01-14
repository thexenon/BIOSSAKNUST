const mongoose = require('mongoose');

const mainAnonSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'A message must be set'],
      trim: true,
      minlength: [10, 'Message can not be less than 10 characters'],
    },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reactions: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdAt: {
      type: Date,
      default: Date.now(),
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

const MainAnon = mongoose.model('MainAnon', mainAnonSchema);

module.exports = MainAnon;
