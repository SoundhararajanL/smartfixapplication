const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: true,
  },
  fields: mongoose.Schema.Types.Mixed, // Storing fields as a mixed type for flexibility
});

// Pre-save hook to format date strings to Date objects
formSchema.pre('save', function (next) {
  const formattedFields = {};

  for (const fieldName in this.fields) {
    if (typeof this.fields[fieldName] === 'string' && this.fields[fieldName].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
      formattedFields[fieldName] = new Date(this.fields[fieldName]);
    } else {
      formattedFields[fieldName] = this.fields[fieldName];
    }
  }

  this.fields = formattedFields;
  next();
});

const Form = mongoose.model('AAAA', formSchema);

module.exports = Form;
