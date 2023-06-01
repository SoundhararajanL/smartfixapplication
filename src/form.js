import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css'

const FormPage = () => {
  const [templateNames, setTemplateNames] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    fetchTemplateNames();

    const interval = setInterval(fetchTemplateNames, 5000); // Refresh every 5 seconds

    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  const fetchTemplateNames = () => {
    axios
      .get('http://localhost:3000/get')
      .then((response) => {
        setTemplateNames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching template names:', error);
      });
  };

  const handleSelectChange = async (templateId, selectedOption) => {
    try {
      const response = await axios.get(`http://localhost:3000/getFields/${templateId}`);
      const templateFields = response.data;
      setSelectedTemplate(selectedOption);
      setFields(templateFields);
      setFormValues({}); // Reset form values when selecting a new template
    } catch (error) {
      console.error('Error fetching template fields:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedTemplate) {
      axios
        .post('http://localhost:3000/post', {
          templateName: selectedTemplate,
          fields: [...fields, ...Object.entries(formValues).map(([field, value]) => ({ field, value }))],
        })
        .then((response) => {
          console.log('Form data submitted successfully:', response.data);
          setFormValues({}); // Reset form values after submission
        })
        .catch((error) => {
          console.error('Error submitting form data:', error);
        });
    }
  };

  const handleDeleteTemplate = (templateName) => {
    axios
      .delete(`http://localhost:3000/delete/${templateName}`)
      .then((response) => {
        console.log('Template deleted successfully:', response.data);
        // Refresh the template names
        fetchTemplateNames();
      })
      .catch((error) => {
        console.error('Error deleting template:', error);
      });
  };

  return (
    <div>
      <h1>Template Names</h1>
      <div>
        <Link to="/display">
          <button type="button" className="btn btn-outline-primary">
            Back
          </button>
        </Link>
      </div>
      <ul>
        {templateNames.map((template) => (
          <li key={template._id}>
            {template.templateName}
            <button onClick={() => handleSelectChange(template._id, template.templateName)}>
              Select Form
            </button>
            <button onClick={() => handleDeleteTemplate(template.templateName)} className="delete-icon ">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>

      {selectedTemplate && (
        <div>
          <h2>{selectedTemplate} Form:</h2>
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
              <div key={index}>
                <label htmlFor={field.field}>{field.field}</label>
                <input
                  type={field.type}
                  id={field.field}
                  name={field.field}
                  value={formValues[field.field] !== undefined ? formValues[field.field] : ''}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FormPage;
