// models/LogicalError.js
const mongoose = require('mongoose');

const LogicalErrorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  logicalErrors: [
    {
      type: { type: String, required: true },
      category: { type: String},
      message: { type: String, required: true },
      line: { type: Number, required: true }
    }
  ],
  timestamp: { type: Date, default: Date.now }
});

const LogicalError = mongoose.model('LogicalError', LogicalErrorSchema);
module.exports = LogicalError;
