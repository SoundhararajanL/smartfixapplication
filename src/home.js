import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import axios from 'axios';

function Home() {
  const [templateName, setTemplateName] = useState('');
  const [fields, setFields] = useState([{ field: '', type: '', value: '' }]);
  const [showTable, setShowTable] = useState(false);
  const [jobcard, setJobCard] = useState(false);

  const handleAddField = () => {
    setFields([...fields, { field: '', type: '', value: '' }]);
  };

  const handleFieldChange = (index, fieldProperty, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldProperty] = value;
    setFields(updatedFields);
  };

  const handleResetFields = () => {
    setTemplateName('');
    setFields([{ field: '', type: '', value: '' }]);
    setShowTable(false); // Hide the table after resetting fields
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleSaveTemplate = () => {
    // Check if any required fields are empty
    const hasEmptyFields = fields.some((field) => field.field === '' || field.type === '');

    if (hasEmptyFields) {
      toast.error('Please fill in all required fields.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return; // Stop execution if there are empty fields
    }

    setShowTable(true);

    const templateData = {
      templateName,
      fields: fields.map((field) => ({
        field: field.field,
        type: field.type,
      })),
    };

    axios
      .post('http://localhost:3000/HomeData', templateData)
      .then((response) => {
        toast.success('Template saved successfully!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          onClose: () => {
            setShowTable(true); // Show the table after closing the success message
          },
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error occurred while saving template!', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  return (
    <div>
      <div className="container mt-4">
        <div className="text-center mb-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setJobCard(true)}
          >
            Create Job Card Template
          </button>
        </div>
      </div>

      {jobcard && (
        <div className="card text-center" id="exampleModalCenter" tabIndex="-1" role="dialog">
          <div className="card-header" role="document">
            <div>
              <div>
                <h5>Create Job Card Template</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="card-text">
                    <label className="card-title" htmlFor="templateName">Template Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter template name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                    <label className="card-title mt-3" htmlFor="fields">Fields</label>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Field name"
                                value={field.field}
                                onChange={(e) => handleFieldChange(index, 'field', e.target.value)}
                              />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                value={field.type}
                                onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                              >
                                <option value="">-- Select --</option>
                                <option value="text">Text</option>
                                <option value="email">Date</option>
                                <option value="number">Number</option>
                              </select>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveField(index)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleAddField}
                    >
                      Add Field
                    </button>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleResetFields}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSaveTemplate}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTable && (
        <div className="container mt-4">
          <h4>Saved Template: {templateName}</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={index}>
                  <td>{field.field}</td>
                  <td>{field.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
