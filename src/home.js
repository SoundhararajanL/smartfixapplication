import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import axios from 'axios';

function Home() {
  const defaultFields = [{ field: '', type: '' }];

  const [jobCardTemplates, setJobCardTemplates] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleAddTemplate = () => {
    setJobCardTemplates([{ templateName: '', fields: [...defaultFields] }]);
  };

  const handleSaveTemplate = (index) => {
    const template = jobCardTemplates[index];

    // Check if the template name is filled
    if (template.templateName.trim() === '') {
      toast.error('Please enter a template name.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return; // Stop execution if the template name is empty
    }

    // Check if any required fields are empty
    const hasEmptyFields = template.fields.some(
      (field) => field.field === '' || field.type === ''
    );

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
        setTimeout(() => {
          setShowTable(false);
          setJobCardTemplates([]);
        }, 1000);
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

  const handleResetFields = (index) => {
    const updatedTemplates = [...jobCardTemplates];
    updatedTemplates[index].fields = [...defaultFields];
    setJobCardTemplates(updatedTemplates);
  };

  const jobCardTemplate = jobCardTemplates[0];

  return (
    <div>
      <div className="container mt-4">
        <div className="text-center mb-4">
          <button type="button" className="btn btn-primary" onClick={handleAddTemplate}>
            Create Job Card Template
          </button>
        </div>
      </div>

      {jobCardTemplate && (
        <div
          className="card text-center"
          id={`exampleModalCenter-${0}`}
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
                    <label className="card-title" htmlFor={`templateName-${0}`}>
                      Template Name
                    </label>
                    <input
                      type="text"
                      className="form-control mx-auto"
                      placeholder="Enter template name"
                      value={jobCardTemplate.templateName}
                      onChange={(e) => {
                        const updatedTemplates = [...jobCardTemplates];
                        updatedTemplates[0].templateName = e.target.value;
                        setJobCardTemplates(updatedTemplates);
                      }}
                      style={{ width: '200px' }} // Adjust the width as needed
                      id={`templateName-${0}`}
                    />

                    <label className="card-title mt-3" htmlFor={`fields-${0}`}>
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
                                  updatedTemplates[0].fields[fieldIndex].field = e.target.value;
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
                                  updatedTemplates[0].fields[fieldIndex].type = e.target.value;
                                  setJobCardTemplates(updatedTemplates);
                                }}
                              >
                                <option value="" hidden selected>
                                  -- Select --
                                </option>
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
                                  updatedTemplates[0].fields.splice(fieldIndex, 1);
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
                        updatedTemplates[0].fields.push({ field: '', type: '' });
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
                  onClick={() => handleRemoveTemplate(0)}
                >
                  Remove Template
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleResetFields(0)}
                >
                  Reset Fields
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleSaveTemplate(0)}
                  disabled={jobCardTemplate.fields.length === 0}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
