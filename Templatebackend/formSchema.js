const mongoose = require('mongoose');
const formValues = new mongoose.Schema({
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
        
        value: {
          type: String,
          required:true,
        },
      },
    ],
  });
  
  module.exports = mongoose.model('form', formValues);