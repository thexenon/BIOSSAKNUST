const mongoose = require('mongoose');

const chatCacheSchema = new mongoose.Schema(
  {
    promptHash: { type: String, required: true, unique: true },
    prompt: String,
    response: String,
    model: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ChatCache', chatCacheSchema);
