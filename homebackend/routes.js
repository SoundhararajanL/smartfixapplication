const express = require('express');
const router = express.Router();
const Template = require('./schema');

// Save template route
router.post('/', async (req, res) => {
  try {
    const { templateName, fields } = req.body;

    const template = new Template({
      templateName,
      fields,
    });

    const savedTemplate = await template.save();

    res.status(200).json(savedTemplate.fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while saving template data!' });
  }
});

module.exports = router;
