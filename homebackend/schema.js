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
        default: false,
      },
      range: {
        NumberMin: {
          type: Number,
          default: null,
        
        },
        NumberMax: {
          type: Number,
          default: null,
          
        },
        startDate: {
          type: Date,
          default: null,
        },
        endDate: {
          type: Date,
          default: null,
        },
      },
    },
  ],
});

module.exports = mongoose.model('Template', templateSchema);
