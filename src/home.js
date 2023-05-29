import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import axios from 'axios';

function Home() {
  const [fields, setFields] = useState([{ label: '', type: '', value: '', image: null }]);
  const [showTable, setShowTable] = useState(false);


  const handleAddField = () => {
    setFields([...fields, { label: '', type: '', value: '', image: null }]);
  };

  const handleFieldChange = (index, fieldProperty, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldProperty] = value;

    // Validate email format if the field type is email and the value is not empty
    if (fieldProperty === 'type' && value === 'email' && updatedFields[index].value !== '') {
      if (!validateEmail(updatedFields[index].value)) {
        toast.error('Please enter a valid email address.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    }

    setFields(updatedFields);
  };

  const handleResetFields = () => {
    setFields([{ label: '', type: '', value: '', image: null }]);
    setShowTable(false); // Hide the table after resetting fields

  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleSaveTemplate = () => {
    // Check if any required fields are empty
    const hasEmptyFields = fields.some((field) => field.label === '' || field.type === '' || field.value === '');

    if (hasEmptyFields) {
      toast.error('Please fill in all required fields.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return; // Stop execution if there are empty fields
    }

    // Check if any email field has an invalid email format
    const hasInvalidEmail = fields.some(
      (field) => field.type === 'email' && !validateEmail(field.value)
    );

    if (hasInvalidEmail) {
      toast.error('Please enter valid email addresses.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return; // Stop execution if there are invalid email fields
    }

    setShowTable(true);

    const templateData = {
      fields: fields.map((field) => ({
        label: field.label,
        type: field.type,
        value: field.value,
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

  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <div className="container mt-4">
        <div className="text-center mb-4">
          <button
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Create Job Card Template
          </button>
        </div>
      </div>

      <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Job Card Template</h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="fields">Fields</label>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Label</th>
                        <th>Type</th>
                        <th>Value</th>
                        {/* <th>Image</th> */}
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
                              placeholder='field name'
                              value={field.label}
                              onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
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
                              <option value="email">Email</option>
                              <option value="number">Number</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type={field.type === 'number' ? 'number' : 'text'}
                              className="form-control"
                              placeholder='value'
                              value={field.value}
                              onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                            />
                          </td>
                          {/* <td>
                            <input
                              type="file"
                              className="form-control-file"
                              onChange={(e) => handleImageUpload(index, e)}
                            />
                          </td> */}
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
                    type="button"
                    className="btn btn-primary btn-sm"
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

      {
        showTable && (
          <div className="container mt-4">
            <h4>Saved Template</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={index}>
                    <td>{field.label}</td>
                    <td>{field.type}</td>
                    <td>{field.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      <ToastContainer />
    </div >
  );
}

export default Home;
