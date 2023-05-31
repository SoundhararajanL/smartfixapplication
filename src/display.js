import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Home from './home';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TemplateList = () => {
  const [templateNames, setTemplateNames] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');

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

  const handleTemplateNameClick = (templateName) => {
    setSelectedTemplateName(templateName);
  };

  const handleFieldNameChange = (event) => {
    setFieldName(event.target.value);
  };

  const handleFieldTypeChange = (event) => {
    setFieldType(event.target.value);
  };

  const handleSaveField = () => {
    if (!selectedTemplateName) {
      return; // No template selected, do nothing
    }

    const newField = {
      field: fieldName,
      type: fieldType,
    };

    const templateData = {
      templateName: selectedTemplateName,
      fields: [newField],
    };

    axios
      .post('http://localhost:3000/store', templateData)
      .then((response) => {
        console.log('Field saved/updated successfully:', response.data);
        // Clear the field name and type
        setFieldName('');
        setFieldType('text');
        // Refresh the template names
        fetchTemplateNames();
      })
      .catch((error) => {
        console.error('Error saving/updating field:', error);
      });
  };

  const renderAdditionalFields = () => {
    if (selectedTemplateName) {
      return (
        <div>
          <label htmlFor="fieldName">Field Name:</label>
          <input
            type="text"
            id="fieldName"
            placeholder="Field Name"
            value={fieldName}
            onChange={handleFieldNameChange}
          />

          <label htmlFor="fieldType">Field Type:</label>
          <select id="fieldType" value={fieldType} onChange={handleFieldTypeChange}>
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
          </select>

          <button onClick={handleSaveField}>Save Field</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ToastContainer /> {/* ToastContainer for displaying notifications */}
      <div>
        <Home />
      </div>
      <h1>Template Names</h1>
      <ul>
        {templateNames.map((template) => (
          <li key={template._id}>
            <span>{template.templateName}</span>
            <span
              className="icon"
              onClick={() => handleTemplateNameClick(template.templateName)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </span>
          </li>
        ))}
      </ul>
      {renderAdditionalFields()}
    </div>
  );
};

export default TemplateList;