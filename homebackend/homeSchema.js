const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
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
    },
  ],
});

module.exports = mongoose.model('Home', homeSchema);
