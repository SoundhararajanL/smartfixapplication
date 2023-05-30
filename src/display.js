import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './home';

const TemplateList = () => {
  const [templateNames, setTemplateNames] = useState([]);

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

  return (
    <div>
      <div>
        <Home />
      </div>
      <h1>Template Names</h1>
      <ul>
        {templateNames.map(template => (
          <li key={template._id}>{template.templateName}</li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateList;
