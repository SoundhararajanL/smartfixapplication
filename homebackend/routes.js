const express = require('express');
const router = express.Router();
const Home = require('./schema');

// Save template route
router.post('/', async (req, res) => {
  try {
    const { fields } = req.body;

    const homeData = new Home({
      fields,
    });

    const savedHomeData = await homeData.save();

    res.status(200).json(savedHomeData);
  } catch (err) {
    res.status(500).json({ error: 'Error occurred while saving template data!' });
  }
});

module.exports = router;
