const mongoose = require('mongoose');

const randomSchema = new mongoose.Schema({
  templateName: String,
  formSubmissions: [{
    _id: Number,
    Name: String,
    age: Number,
    'Emp ID': String,
    City: String,
    Email: String,
    'Phone Number': String,
    Address: String,
    State: String,
    Country: String,
    'Role/Position': String,
    Organization: String,
    Department: String,
    'Social Media Profiles: Links': String,
    Interests: String,
    'Date of Join': String,
    Degree: String,
    Experience: Number,
    Status: String,
    'Date of Birth': String
  }]
});

module.exports = mongoose.model('RandomForm', randomSchema);