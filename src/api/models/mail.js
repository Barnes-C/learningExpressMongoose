const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sender: { type: String, required: true },
  reciever: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  spam: Boolean,
  send: Date,
});

module.exports = mongoose.model('Mail', mailSchema);
