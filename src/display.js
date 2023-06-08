import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter, faPlus, faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import Home from './home';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const TemplateList = () => {
  const [templateNames, setTemplateNames] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState(null);
  const [templateFields, setTemplateFields] = useState([]);
  const [editingFields, setEditingFields] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleTemplateNameClick = async (templateName) => {
    setSelectedTemplateName(templateName);

    try {
      const response = await axios.get(`http://localhost:3000/template/${templateName}`);
      setTemplateFields(response.data.fields);
      setEditingFields(response.data.fields);
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching template fields:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...editingFields];
    updatedFields[index][field] = value;
    setEditingFields(updatedFields);
  };

  const handleSaveClick = async () => {
    if (editingFields.length === 0) {
      toast.error('At least one field is required');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/template/${selectedTemplateName}`, {
        fields: editingFields,
      });
      toast.success('Template updated successfully', { autoClose: 500 });
      setIsEditing(false);
      setTemplateFields([...editingFields]);
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    }
  };

  const handleAddField = () => {
    const newField = {
      field: '',
      type: 'text',
      required: false,
      range: {
        NumberMin: 0,
        NumberMax: 0,
      },
    };
    setEditingFields((prevFields) => [...prevFields, { ...newField }]);
  };

  const handleDeleteField = (index) => {
    const updatedFields = [...editingFields];
    updatedFields.splice(index, 1);
    setEditingFields(updatedFields);
  };

  const handleToggleRequired = (index) => {
    const updatedFields = [...editingFields];
    updatedFields[index].required = !updatedFields[index].required;
    setEditingFields(updatedFields);
  };

  const handleRangeChange = (index, field, value) => {
    const updatedFields = [...editingFields];
    updatedFields[index].range[field] = value;
    setEditingFields(updatedFields);
  };

  const handleForm = () => {
    navigate('/form', { state: { loginSuccess: true } });
  };

  const renderTemplateFields = () => {
    if (selectedTemplateName) {
      return (
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4>Template: {selectedTemplateName}</h4>
            {isEditing ? (
              <button className="btn btn-primary" onClick={handleSaveClick}>
                <FontAwesomeIcon icon={faSave} /> Save Template
              </button>
            ) : (
              <FontAwesomeIcon icon={faEdit} onClick={handleEditClick} />
            )}
          </div>
          <table className="display-table">
            <thead className="thead">
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Required</th>
                <th>Range - Min</th>
                <th>Range - Max</th>
                {isEditing && <th>Delete</th>}
              </tr>
            </thead>
            <tbody className='tbody'>
              {isEditing ? (
                editingFields.map((field, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={field.field}
                        onChange={(e) => handleFieldChange(index, 'field', e.target.value)}
                      />
                    </td>

                    <td>
                      <select
                        value={field.type}
                        onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                      </select>
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={() => handleToggleRequired(index)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={field.range.NumberMin}
                        onChange={(e) => handleRangeChange(index, 'NumberMin', e.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={field.range.NumberMax}
                        onChange={(e) => handleRangeChange(index, 'NumberMax', e.target.value)}
                      />
                    </td>

                    <td>
                      <button className="btn btn-danger" onClick={() => handleDeleteField(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                templateFields.map((field, index) => (
                  <tr key={index}>
                    <td>{field.field}</td>
                    <td>{field.type}</td>
                    <td>{field.required ? 'Clicked Required' : 'Un-Clicked Required'}</td>
                    <td>{field.range.NumberMin}</td>
                    <td>{field.range.NumberMax}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {isEditing && (
            <button className="display-addfield"  onClick={handleAddField}>
              Add Field
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ToastContainer />
      <div>
        <Home />
        <div>
          <button onClick={handleForm} type="button" className="btn btn-warning">
            Form
          </button>
        </div>
      </div>

      <h5 class="badge bg-secondary">Template Names</h5>
      <ol class="list-group list-group-numbered">
        {templateNames.map((template) => (
          <li class="list-group-item d-flex justify-content-between align-items-start" key={template._id}>
            <div class="ms-2 me-auto">
              <div class="fw-bold">
                <span>{template.templateName}</span>
              </div>
            </div>
            <span className="icon" onClick={() => handleTemplateNameClick(template.templateName)}>
              <div class="badge bg-primary rounded-pill">
                <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
              </div>
            </span>
          </li>
        ))}
      </ol>
      {renderTemplateFields()}
    </div>
  );
};

export default TemplateList;
