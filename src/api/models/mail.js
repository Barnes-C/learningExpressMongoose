const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId(),
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  content: { type: String, required: true },
  spam: { type: Boolean, default: true },
  sent: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Mail', mailSchema, 'mails');
