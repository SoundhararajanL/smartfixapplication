const express = require('express');
const router = express.Router();
const Template = require('./schema');
const Form = require("./formSchema")
const formData = require("./formSchema")

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

// Route to fetch fields and types for a specific template
router.get('/template/:templateName', async (req, res) => {
  const { templateName } = req.params;

  try {
    const template = await Template.findOne({ templateName });
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const { fields } = template;
    res.json({ fields });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Internal server error' });
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


// Update template route
router.put('/template/:templateName', async (req, res) => {
  const { templateName } = req.params;
  const { fields } = req.body;

  try {
    // Find the template by name
    const template = await Template.findOne({ templateName });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Update the fields
    template.fields = fields;

    // Save the updated template
    await template.save();

    res.json({ message: 'Template updated successfully' });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});


router.get('/formdata', (req, res) => {
  formData.find()
    .then(templates => {
      res.json(templates);
    })
    .catch(error => {
      console.error('Error fetching templates:', error);
      res.status(500).json({ error: 'An error occurred while fetching templates.' });
    });
});

module.exports = router;