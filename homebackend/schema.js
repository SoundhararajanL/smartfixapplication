const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  fields: [
    {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Home', schema);
