const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    createIndexes: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  age: Date,
  subscribed: { type: Boolean, default: false },
  created: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('User', userSchema);
