const mongoose = require('mongoose');

const randomSchema = new mongoose.Schema({
  templateName: String,
  formSubmissions: {
    Name: String,
    age: Number,
    'Emp ID': String,
    City: String,
    Email: String,
    'Phone Number': String,
    Address: String,
    State: String,
    Country: String,
    'Role-Position': String,
    Organization: String,
    Department: String,
    'Social Media Profiles: Links': String,
    Interests: String,
    'Date of Join': Date,
    Degree: String,
    Experience: Number,
    Status: String,
    'Date of Birth': Date, // "Date of Birth" is correctly defined as a Date type
  }
});

module.exports = mongoose.model('newrandomvalue', randomSchema);
