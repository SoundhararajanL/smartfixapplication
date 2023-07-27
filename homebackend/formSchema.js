const mongoose = require('mongoose');

const formValuesSchema = new mongoose.Schema({
  templateName: String,
  formSubmissions: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('FormData', formValuesSchema);
