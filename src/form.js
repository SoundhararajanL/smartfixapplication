import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useNavigate } from 'react-router-dom';

const FormPage = () => {
  const [templateNames, setTemplateNames] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();

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

    // Check if the label is "email" and apply email validation if required
    const field = fields.find((field) => field.field.toLowerCase() === name.toLowerCase());
    if (field && field.required && field.type === 'email') {
      if (!validateEmail(value)) {
        event.target.setCustomValidity('Please enter a valid email address.');
      } else {
        event.target.setCustomValidity('');
      }
    } else if (field && field.type === 'number' && field.range) {
      const { NumberMin, NumberMax } = field.range;
      if (NumberMin && NumberMax) {
        if (value < NumberMin || value > NumberMax) {
          event.target.setCustomValidity(`Please enter a value between ${NumberMin} and ${NumberMax}.`);
        } else {
          event.target.setCustomValidity('');
        }
      } else if (NumberMin) {
        if (value < NumberMin) {
          event.target.setCustomValidity(`Please enter a value greater than or equal to ${NumberMin}.`);
        } else {
          event.target.setCustomValidity('');
        }
      } else if (NumberMax) {
        if (value > NumberMax) {
          event.target.setCustomValidity(`Please enter a value less than or equal to ${NumberMax}.`);
        } else {
          event.target.setCustomValidity('');
        }
      } else {
        event.target.setCustomValidity('');
      }
    } else {
      event.target.setCustomValidity('');
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedTemplate) {
      const requiredFields = fields.filter((field) => field.required);
      const missingRequiredFields = requiredFields.filter((field) => !formValues[field.field]);

      if (missingRequiredFields.length > 0) {
        toast.error('Please fill in all the required fields.');
      } else {
        axios
          .post('http://localhost:3000/form', {
            templateName: selectedTemplate,
            fields: Object.entries(formValues).map(([field, value]) => ({ field, value })),
          })
          .then((response) => {
            console.log('Form data submitted successfully:', response.data);
            setFormValues({});
            toast.success('Form registered successfully', { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
            setTimeout(() => {
              window.location.reload(); // Reload the page after a delay (e.g., 2 seconds)
            }, 2000); // Reload the page
          })
          .catch((error) => {
            console.error('Error submitting form data:', error);
          });
      }
    }
  };

  const validateEmail = (email) => {
    // Use a comprehensive regular expression for email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
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

  const handleDisplay = () => {
    navigate('/display', { state: { loginSuccess: true } });
  };

  return (
    <div>
      <h1 className="bold-text">Form</h1>
      <div>
        <button onClick={handleDisplay} type="button" className="btn btn-outline-primary">
          Back
        </button>
      </div>
      <div>
        <label className="badge bg-secondary" htmlFor="templateSelect">
          Select Form
        </label>
        <select
          className="form-select"
          id="templateSelect"
          onChange={(e) =>
            handleSelectChange(e.target.value, e.target.options[e.target.selectedIndex].text)
          }
        >
          <option value="" hidden>
            Select a template
          </option>
          {templateNames.map((template) => (
            <option key={template._id} value={template._id}>
              {template.templateName}
            </option>
          ))}
        </select>
      </div>

      {selectedTemplate && (
        <div>
          <h3 className="italic-text">{selectedTemplate}</h3>
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
              <div className="input-group mb-3" key={index}>
                <label className="input-group-text" htmlFor={field.field}>
                  {field.field} {field.required && <span style={{ color: 'red' }} className="label-badge">*</span>}
                </label>
                {field.field.toLowerCase() === 'email' ? (
                  <input
                    className="form-control"
                    type="email"
                    id={field.field}
                    name={field.field}
                    value={formValues[field.field] !== undefined ? formValues[field.field] : ''}
                    onChange={handleInputChange}
                    required={field.required}
                  />
                ) : (
                  <input
                    className="form-control"
                    type={field.type}
                    id={field.field}
                    name={field.field}
                    value={formValues[field.field] !== undefined ? formValues[field.field] : ''}
                    onChange={handleInputChange}
                    required={field.required}
                    min={field.range ? field.range.NumberMin : undefined}
                    max={field.range ? field.range.NumberMax : undefined}
                  />
                )}
              </div>
            ))}
            <button className="btn btn-success" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FormPage;
