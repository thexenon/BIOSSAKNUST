const mongoose = require('mongoose');

const yearAnonSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'A message must be set'],
      trim: true,
      minlength: [10, 'Message can not be less than 10 characters'],
    },
    year: {
      type: String,
      required: [true, 'A Level must be set'],
      enum: {
        values: ['100', '200', '300', '400'],
        message: 'Level is either ||100|200|300|400||',
      },
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

yearAnonSchema.virtual('comments', {
  ref: 'YearComment',
  foreignField: 'yearmessage',
  localField: '_id',
});

const YearAnon = mongoose.model('YearAnon', yearAnonSchema);

module.exports = YearAnon;
