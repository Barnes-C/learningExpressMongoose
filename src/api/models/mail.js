const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  content: { type: String, required: true },
  spam: Boolean,
  send: Date,
});

module.exports = mongoose.model('Mail', mailSchema);
