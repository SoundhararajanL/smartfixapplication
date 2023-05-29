import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import axios from 'axios';

function Home() {
  const [jobCardTemplates, setJobCardTemplates] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleAddTemplate = () => {
    setJobCardTemplates([...jobCardTemplates, { templateName: '', fields: [{ field: '', type: 'select' }] }]);
  };

  const handleSaveTemplate = (index) => {
    const template = jobCardTemplates[index];

    // Check if any required fields are empty
    const hasEmptyFields = template.fields.some((field) => field.field === '' || field.type === '');

    if (hasEmptyFields) {
      toast.error('Please fill in all required fields.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return; // Stop execution if there are empty fields
    }

    const templateData = {
      templateName: template.templateName,
      fields: template.fields.map((field) => ({
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
        });
        setShowTable(true);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error occurred while saving template!', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  const handleRemoveTemplate = (index) => {
    const updatedTemplates = [...jobCardTemplates];
    updatedTemplates.splice(index, 1);
    setJobCardTemplates(updatedTemplates);
  };

  return (
    <div>
      <div className="container mt-4">
        <div className="text-center mb-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddTemplate}
          >
            Create Job Card Template
          </button>
        </div>
      </div>

      {jobCardTemplates.map((jobCardTemplate, index) => (
        <div
          key={index}
          className="card text-center"
          id={`exampleModalCenter-${index}`}
          tabIndex="-1"
          role="dialog"
        >
          <div className="card-header" role="document">
            <div>
              <div>
                <h5>Job Card Template</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="card-text">
                    <label className="card-title" htmlFor={`templateName-${index}`}>
                      Template Name
                    </label>
                    <input
                      type="text"
                      className="form-control mx-auto"
                      placeholder="Enter template name"
                      value={jobCardTemplate.templateName}
                      onChange={(e) => {
                        const updatedTemplates = [...jobCardTemplates];
                        updatedTemplates[index].templateName = e.target.value;
                        setJobCardTemplates(updatedTemplates);
                      }}
                      style={{ width: '200px' }} // Adjust the width as needed
                      id={`templateName-${index}`}
                    />

                    <label className="card-title mt-3" htmlFor={`fields-${index}`}>
                      Fields
                    </label>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobCardTemplate.fields.map((field, fieldIndex) => (
                          <tr key={fieldIndex}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Field name"
                                value={field.field}
                                onChange={(e) => {
                                  const updatedTemplates = [...jobCardTemplates];
                                  updatedTemplates[index].fields[fieldIndex].field = e.target.value;
                                  setJobCardTemplates(updatedTemplates);
                                }}
                              />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                value={field.type}
                                onChange={(e) => {
                                  const updatedTemplates = [...jobCardTemplates];
                                  updatedTemplates[index].fields[fieldIndex].type = e.target.value;
                                  setJobCardTemplates(updatedTemplates);
                                }}
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
                                onClick={() => {
                                  const updatedTemplates = [...jobCardTemplates];
                                  updatedTemplates[index].fields.splice(fieldIndex, 1);
                                  setJobCardTemplates(updatedTemplates);
                                }}
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
                      onClick={() => {
                        const updatedTemplates = [...jobCardTemplates];
                        updatedTemplates[index].fields.push({ field: '', type: '' });
                        setJobCardTemplates(updatedTemplates);
                      }}
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
                  onClick={() => handleRemoveTemplate(index)}
                >
                  Remove Template
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleSaveTemplate(index)}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {showTable && jobCardTemplates.length > 0 && (
        <div className="container mt-4">
          <h4>Saved Templates:</h4>
          {jobCardTemplates.map((jobCardTemplate, index) => (
            <div key={index}>
              <h6>Template Name: {jobCardTemplate.templateName}</h6>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {jobCardTemplate.fields.map((field, fieldIndex) => (
                    <tr key={fieldIndex}>
                      <td>{field.field}</td>
                      <td>{field.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
