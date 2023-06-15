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

  const renderTemplateTable = () => {
    const templateFields = selectedTemplates.reduce((fields, template) => {
      template.fields.forEach((field) => {
        if (!fields.includes(field.field)) {
          fields.push(field.field);
        }
      });
      return fields;
    }, []);

    return (
      <table className="center-table">
        <thead className="thead">
          <tr>
            {templateFields.map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody className="tbody">
          {selectedTemplates.map((template, index) => (
            <tr key={index}>
              {templateFields.map((field) => {
                const fieldValue = template.fields.find(
                  (f) => f.field === field
                );
                return <td key={field}>{fieldValue ? fieldValue.value : ''}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <button className="button-8" onClick={handleForm}>
        Back
      </button>
      <h2 className="Form-font">Form collection</h2>

      <select onChange={handleTemplateChange}>
        <option value="" hidden>
          --Form collection--
        </option>
        {getTemplateOptions()}
      </select>

      {selectedTemplates.length > 0 && showTable && (
        <div className="horizontal-tables">
          <div className="table-container">
            {renderTemplateTable()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormData;
