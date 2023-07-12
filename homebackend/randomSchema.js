const mongoose = require('mongoose');

const randomSchema = new mongoose.Schema({
  templateName: String,
  formSubmissions: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('FormCollections', randomSchema);
