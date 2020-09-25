const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  age: Date,
  subscribed: Boolean,
  created: Date,
});

module.exports = mongoose.model('Member', memberSchema);
