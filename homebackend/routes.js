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
      // Template already exists, update the field values
      fields.forEach(({ field, value }) => {
        const existingField = existingTemplate.fields.find((f) => f.field === field);
        if (existingField) {
          existingField.value = value;
        } else {
          existingTemplate.fields.push({ field, value });
        }
      });

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

// Fetch template fields route
router.get('/getFields/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await Template.findById(templateId, 'fields');
    if (template) {
      res.status(200).json(template.fields);
    } else {
      res.status(404).json({ error: 'Template not found!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while fetching template fields!' });
  }
});

module.exports = router;
