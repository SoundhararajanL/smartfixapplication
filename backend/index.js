const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Router
const PersonRouter = require('./PersonsRoute');
app.use('/persons', PersonRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(
  process.env.MYDB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log('DB not connected', err);
    } else {
      console.log('DB connected successfully');
    }
  }
);