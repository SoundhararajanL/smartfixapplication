const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: true,
  },
  fields: [
    {
      field: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      value: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('Template', templateSchema);
