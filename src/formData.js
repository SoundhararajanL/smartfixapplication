import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const FormData = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch templates from MongoDB collection
    axios
      .get('http://localhost:3000/formdata')
      .then((response) => {
        setTemplates(response.data);
      })
      .catch((error) => {
        console.error('Error fetching templates:', error);
      });
  }, []);

  useEffect(() => {
    const selected = templates.filter(
      (template) => template.templateName === selectedTemplateName
    );
    setSelectedTemplates(selected);
    setShowTable(true);
  }, [selectedTemplateName, templates]);

  const handleTemplateChange = (event) => {
    setSelectedTemplateName(event.target.value);
  };

  const getTemplateOptions = () => {
    const uniqueTemplateNames = Array.from(
      new Set(templates.map((template) => template.templateName))
    );

    return uniqueTemplateNames.map((templateName) => (
      <option key={templateName} value={templateName}>
        {templateName}
      </option>
    ));
  };

  const handleForm = () => {
    navigate('/form', { state: { loginSuccess: true } });
  };

  return (
    <div>
      <button className="button-8" onClick={handleForm}>
        Back
      </button>
      <h2 className='Form-font' >Form collection</h2>

      <select onChange={handleTemplateChange}>
        <option  value="" hidden>
          --Form collection--
        </option>
        {getTemplateOptions()}
      </select>

      {selectedTemplates.length > 0 && showTable && (
        <div className="horizontal-tables">
          {selectedTemplates.map((template, index) => (
            <div className="table-container" key={index}>
              <h4 className="form-name">{selectedTemplateName}</h4>
              <h5 className="center-table">Template #{index + 1}</h5>
              <table className="center-table">
                <thead className="thead">
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {template.fields.map((field, index) => (
                    <tr key={index}>
                      <td>{field.field}</td>
                      <td>{field.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table> 
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormData;
