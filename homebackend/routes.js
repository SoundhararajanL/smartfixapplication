const express = require('express');
const router = express.Router();
const Template = require('./schema');

// Save template route
router.post('/', async (req, res) => {
  try {
    const { templateName, field } = req.body;

    const template = await Template.findOne({ templateName });

    if (template) {
      template.fields.push(field);
      await template.save();
      res.status(200).json(template.fields);
    } else {
      const newTemplate = new Template({
        templateName,
        fields: [field],
      });

      const savedTemplate = await newTemplate.save();
      res.status(200).json(savedTemplate.fields);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while saving template data!' });
  }
});

// Fetch template names route
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find({}, 'templateName');
    res.status(200).json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while fetching template names!' });
  }
});

module.exports = router;
