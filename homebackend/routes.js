const express = require('express');
const router = express.Router();
const Template = require('./schema');
const Form = require("./formSchema")
const formData = require("./formSchema")
const RandomForm = require('./randomSchema');
const chart = require("./formSchema")

router.get('/templateCounts', async (req, res) => {
  try {
    // Aggregate to get the counts of each templateName
    const templateCounts = await chart.aggregate([
      {
        $group: {
          _id: '$templateName',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(templateCounts);
  } catch (err) {
    console.error('Error fetching template name counts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// POST route for submitting random forms
router.post('/random', async (req, res) => {
  try {
    const form = new RandomForm(req.body);
    await form.save();
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Error submitting form' });
  }
});

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
// Assuming you have an Express route defined for handling form submissions

router.post('/form', async (req, res) => {
  try {
    const { templateName, fields } = req.body;

    // Assuming you have a Mongoose model named 'FormValues' defined

    // Create a new document in the 'FormValues' collection
    const formValues = await Form.create({
      templateName,
      formSubmissions: fields,
    });

    res.status(200).json(formValues);
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ error: 'An error occurred while saving the form data.' });
  }
});




router.get('/formdata', async (req, res) => {
  const datasize = 100;
  let allData = [];

  let page = 1;
  let templates = [];

  try {
    do {
      templates = await formData.find()
        .skip((page - 1) * datasize)
        .limit(datasize);
        
      allData = allData.concat(templates);
      page++;
    } while (templates.length === datasize);

    res.json(allData);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'An error occurred while fetching templates.' });
  }
});




router.get('/templates', async (req, res) => {
  try {
    const templates = await formData.distinct('templateName');
    const templateCounts = [];

    for (const template of templates) {
      const count = await formData.countDocuments({ templateName: template });
      templateCounts.push({ templateName: template, count });
    }

    res.json(templateCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/templates/:templateName/:page', async (req, res) => {
  try {
    const { templateName, page } = req.params;
    const itemsPerPage = 100;

    const totalCount = await formData.countDocuments({ templateName });
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const skip = (page - 1) * itemsPerPage;
    const templates = await formData
      .find({ templateName })
      .sort({"_id":1})
      .skip(skip)
      .limit(itemsPerPage);
      

    res.json({ templates, totalCount, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});







module.exports = router;