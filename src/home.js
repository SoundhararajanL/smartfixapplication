import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const defaultFields = [{ field: '', type: '', required: false, range: { NumberMin: '', NumberMax: '' } }];

  const navigate = useNavigate();
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
  
    // Check if any range fields have min value greater than max value
    const hasInvalidRange = template.fields.some((field) => {
      if (field.type === 'number') {
        const min = Number(field.range.NumberMin);
        const max = Number(field.range.NumberMax);
        return min > max || min == max ;
      }
      return false;
    });
  
    if (hasInvalidRange) {
      toast.error('Minimum value should be less than to maximum value.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return; // Stop execution if there are invalid range values
    }
  
    const templateData = {
      templateName: template.templateName,
      fields: template.fields.map((field) => {
        const fieldData = {
          field: field.field,
          type: field.type === 'date' ? 'date' : field.type,
          required: field.required || false,
        };
  
        if (field.type === 'number') {
          fieldData.range = field.range;
        }
  
        return fieldData;
      }),
    };
  
    axios
      .post('http://localhost:3000/home', templateData)
      .then((response) => {
        toast.success('Template saved successfully!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          onClose: () => {
            navigate('/display', { state: { loginSuccess: true } });
          },
        });
        setShowTable(true);
        setTimeout(() => {
          setShowTable(false);
          setJobCardTemplates([]);
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error occurred while saving template! Try change your Template Name ', {
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
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddTemplate}
          >
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
                <h5 className="card-title">Job Card Template</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="card-text">
                    <label htmlFor={`templateName-${0}`} className="form-label">
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

                    <label htmlFor={`fields-${0}`} className="form-label mt-3">
                      Fields
                    </label>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Type</th>
                          <th>Range</th>
                          <th>Required</th>
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
                                  updatedTemplates[0].fields[fieldIndex].field =
                                    e.target.value;
                                  setJobCardTemplates(updatedTemplates);
                                }}
                              />
                            </td>
                            <td>
                              <select
                                className="form-select"
                                value={field.type}
                                onChange={(e) => {
                                  const updatedTemplates = [...jobCardTemplates];
                                  updatedTemplates[0].fields[fieldIndex].type =
                                    e.target.value;
                                  setJobCardTemplates(updatedTemplates);
                                }}
                              >
                                <option value="" hidden>
                                  -- Select --
                                </option>
                                <option value="text">Text</option>
                                <option value="date">Date</option>
                                <option value="number">Number</option>
                              </select>
                            </td>
                            {field.type === 'number' ? (
                              <td>
                                <div className="row">
                                  <div className="col">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Min"
                                      value={field.range.NumberMin}
                                      onChange={(e) => {
                                        const updatedTemplates = [...jobCardTemplates];
                                        updatedTemplates[0].fields[fieldIndex].range.NumberMin =
                                          e.target.value;
                                        setJobCardTemplates(updatedTemplates);
                                      }}
                                    />
                                  </div>
                                  <div className="col">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Max"
                                      value={field.range.NumberMax}
                                      onChange={(e) => {
                                        const updatedTemplates = [...jobCardTemplates];
                                        updatedTemplates[0].fields[fieldIndex].range.NumberMax =
                                          e.target.value;
                                        setJobCardTemplates(updatedTemplates);
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            ) : (
                              <td></td>
                            )}
                            <td>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`required-${fieldIndex}`}
                                  checked={field.required}
                                  onChange={(e) => {
                                    const updatedTemplates = [...jobCardTemplates];
                                    updatedTemplates[0].fields[fieldIndex].required =
                                      e.target.checked;
                                    setJobCardTemplates(updatedTemplates);
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`required-${fieldIndex}`}
                                >
                                  Required
                                </label>
                              </div>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  const updatedTemplates = [...jobCardTemplates];
                                  updatedTemplates[0].fields.splice(
                                    fieldIndex,
                                    1
                                  );
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
                        updatedTemplates[0].fields.push({
                          field: '',
                          type: '',
                          required: false,
                          range: { NumberMin: '', NumberMax: '' },
                        });
                        setJobCardTemplates(updatedTemplates);
                      }}
                    >
                      Add Field
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer text-muted">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleSaveTemplate(0)}
                >
                  Save Template
                </button>
                <button
                  type="button"
                  className="btn btn-warning ml-2"
                  onClick={() => handleResetFields(0)}
                >
                  Reset Fields
                </button>
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={() => handleRemoveTemplate(0)}
                >
                  Remove Template
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
