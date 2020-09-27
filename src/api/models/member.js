const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId(),
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  age: Date,
  subscribed: { type: Boolean, default: true },
  created: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Member', memberSchema);
