const mongoose = require('mongoose');

const mainCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment can not be empty!'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    mainmessage: {
      type: mongoose.Schema.ObjectId,
      ref: 'MainAnon',
      required: [true, 'Comment must belong to a message.'],
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

mainCommentSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

mainCommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sender',
    select: 'name level',
  });
  next();
});

const MainComment = mongoose.model('MainComment', mainCommentSchema);

module.exports = MainComment;
