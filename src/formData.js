import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';

const TemplatePage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    // Fetch templates from MongoDB collection
    axios.get('http://localhost:3000/formdata')
      .then(response => {
        setTemplates(response.data);
      })
      .catch(error => {
        console.error('Error fetching templates:', error);
      });
  }, []);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setShowTable(true);
  };

  return (
    <div>
      <h2>Form collection</h2>
      <ul>
        {templates.map(template => (
          <li key={template._id} onClick={() => handleTemplateClick(template)}>
            <span className="template-name">{template.templateName}</span>
            <span >
              <div className="forward">
                <FontAwesomeIcon icon={faForward} />
              </div>
            </span>
          </li>
        ))}
      </ul>


      {selectedTemplate && showTable && (
        <div>
          <h4>Selected Template: {selectedTemplate.templateName}</h4>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {selectedTemplate.fields.map((field, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{field.field}</td>
                    <td>{field.value}</td>
                  </tr>
                  <tr>
                    <td className="table-line" colSpan="2"></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>


          </table>
        </div>
      )}
    </div>
  );
};

export default TemplatePage;
