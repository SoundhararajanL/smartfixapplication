const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'Persons',
  }
);

module.exports = mongoose.model('Persons', UserDetailsSchema);
