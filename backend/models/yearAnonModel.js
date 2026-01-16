const mongoose = require('mongoose');

const yearAnonSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'A message must be set'],
      trim: true,
      minlength: [10, 'Message can not be less than 10 characters'],
      maxlength: [600, 'Message can not be more than 600 characters'],
    },
    year: {
      type: String,
      required: [true, 'A Level must be set'],
      enum: {
        values: ['100', '200', '300', '400'],
        message: 'Level is either ||100|200|300|400||',
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      required: [true, 'Select a color from the list'],
      default: '#00ff22',
    },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reactions: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    commentors: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

yearAnonSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

yearAnonSchema.virtual('comments', {
  ref: 'YearComment',
  foreignField: 'yearmessage',
  localField: '_id',
});

const YearAnon = mongoose.model('YearAnon', yearAnonSchema);

module.exports = YearAnon;
