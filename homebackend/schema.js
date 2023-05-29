const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
      
    },
  ],
});

module.exports = mongoose.model('Template', schema);
