const mongoose = require('mongoose');

const yearCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment can not be empty!'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    yearmessage: {
      type: mongoose.Schema.ObjectId,
      ref: 'YearAnon',
      required: [true, 'Comment must belong to a message.'],
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

yearCommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sender',
    select: 'name level',
  });
  next();
});

const YearComment = mongoose.model('YearComment', yearCommentSchema);

module.exports = YearComment;
