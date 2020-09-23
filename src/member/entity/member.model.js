const { Schema, model } = require('mongoose');

const memberSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  age: Date,
  active: Boolean,
  created: Date,
});

const MemberModel = model('Members', memberSchema);

module.exports = MemberModel;
