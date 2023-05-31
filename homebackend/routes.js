const express = require('express');
const router = express.Router();
const Template = require('./schema');

// Save template route
router.post('/post', async (req, res) => {
  try {
    const { templateName, fields } = req.body;

    // Find the existing template by name
    const existingTemplate = await Template.findOne({ templateName });

    if (existingTemplate) {
      // Template already exists, add the new fields to the existing fields
      existingTemplate.fields.push(...fields);
      const updatedTemplate = await existingTemplate.save();
      res.status(200).json(updatedTemplate.fields);
    } else {
      // Template doesn't exist, create a new template
      const template = new Template({
        templateName,
        fields,
      });

      const savedTemplate = await template.save();
      res.status(200).json(savedTemplate.fields);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while saving/updating template data!' });
  }
});


// Fetch template names route
router.get('/get', async (req, res) => {
  try {
    const templates = await Template.find({}, 'templateName');
    res.status(200).json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while fetching template names!' });
  }
});

module.exports = router;
