const express = require('express');
const router = express.Router();
const Template = require('./schema');
const Form = require("./formSchema")

router.post('/home', async (req, res) => {
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



// Delete template route
router.delete('/delete/:templateName', async (req, res) => {
  try {
    const { templateName } = req.params;

    // Find the template by name and delete it
    const deletedTemplate = await Template.findOneAndDelete({ templateName });

    if (deletedTemplate) {
      res.status(200).json({ message: 'Template deleted successfully!' });
    } else {
      res.status(404).json({ error: 'Template not found!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while deleting template!' });
  }
});

// Save template route
router.post('/form', async (req, res) => {
  try {
    const { templateName, fields } = req.body;

    const form = new Form({
      templateName,
      fields,
    });

    const savedForm = await form.save();
    res.status(200).json(savedForm);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error occurred while saving form data!' });
  }
});

module.exports = router;