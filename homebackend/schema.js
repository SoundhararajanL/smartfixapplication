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
      required: {
        type: Boolean,
        default: false, // Set the default value for the 'required' field
      },
    },
  ],
});

module.exports = mongoose.model('Template', templateSchema);
