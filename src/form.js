import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

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

  const fetchTemplateNames = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get');
      setTemplateNames(response.data);
    } catch (error) {
      console.error('Error fetching template names:', error);
    }
  };

  const handleSelectChange = async (templateId, selectedOption) => {
    try {
      const response = await axios.get(`http://localhost:3000/getFields/${templateId}`);
      const templateFields = response.data;
      setSelectedTemplate(selectedOption);
      setFields(templateFields);
      setFormValues({});
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
      const requiredFields = fields.filter((field) => field.required);
      const missingFields = requiredFields.filter((field) => !formValues[field.field]);
      if (missingFields.length > 0) {
        const missingFieldNames = missingFields.map((field) => field.field).join(', ');
        toast.error(`Please fill in the required fields: ${missingFieldNames}`);
      } else if (Object.keys(formValues).length === 0) {
        toast.error('Please fill in the required fields');
      } else {
        axios
          .post('http://localhost:3000/form', {
            templateName: selectedTemplate,
            fields: Object.entries(formValues).map(([field, value]) => ({ field, value })),
          })
          .then((response) => {
            console.log('Form data submitted successfully:', response.data);
            setFormValues({});
            toast.success('Form registered successfully',{position: toast.POSITION.TOP_CENTER,autoClose: 1000});
            setTimeout(() => {
              window.location.reload(); // Reload the page after a delay (e.g., 2 seconds)
            }, 2000);// Reload the page
          })
          .catch((error) => {
            console.error('Error submitting form data:', error);
          });
      }
    }
  };

  const handleDeleteTemplate = (templateName) => {
    axios
      .delete(`http://localhost:3000/delete/${templateName}`)
      .then((response) => {
        console.log('Template deleted successfully:', response.data);
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
      <div>
        <label htmlFor="templateSelect">Select Form:</label>
        <select
          id="templateSelect"
          onChange={(e) =>
            handleSelectChange(e.target.value, e.target.options[e.target.selectedIndex].text)
          }
        >
          <option value="">Select a template</option>
          {templateNames.map((template) => (
            <option key={template._id} value={template._id}>
              {template.templateName}
            </option>
          ))}
        </select>
      </div>

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
                  required={field.required}
                />
              </div>
            ))}

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FormPage;
