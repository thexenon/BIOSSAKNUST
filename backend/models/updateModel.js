const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be set'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A name must be set'],
      trim: true,
    },
    isUpdated: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

const Update = mongoose.model('Update', updateSchema);

module.exports = Update;
