import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Home from './home';

const TemplateList = () => {
  const [templateNames, setTemplateNames] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState(null);

  useEffect(() => {
    fetchTemplateNames();

    const interval = setInterval(fetchTemplateNames, 5000); // Refresh every 5 seconds

    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  const fetchTemplateNames = () => {
    axios.get('http://localhost:3000/HomeData')
      .then(response => {
        setTemplateNames(response.data);
      })
      .catch(error => {
        console.error('Error fetching template names:', error);
      });
  };

  const handleTemplateNameClick = (templateName) => {
    setSelectedTemplateName(templateName);
  };

  const renderAdditionalFields = () => {
    if (selectedTemplateName) {
      return (
        <div>
          <label htmlFor="field">Label Name:</label>
          <input type="text" id="field" />

          <select>
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div>
        <Home />
      </div>
      <h1>Template Names</h1>
      <ul>
        {templateNames.map(template => (
          <li key={template._id}>
            <span >{template.templateName}</span>
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
