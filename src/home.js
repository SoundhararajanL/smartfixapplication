import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import axios from 'axios';

function Home() {
  const [fields, setFields] = useState([{ label: '', type: '' }]);
  const [showTable, setShowTable] = useState(false);

  const handleAddField = () => {
    setFields([...fields, { label: '', type: '' }]);
  };

  const handleFieldChange = (index, fieldProperty, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldProperty] = value;

    if (fieldProperty === 'type') {
      updatedFields[index].type = value;
      if (value === 'date') {
        updatedFields[index].label = 'Date';
      } else {
        updatedFields[index].label = '';
      }
    }

    setFields(updatedFields);
  };

  const isFieldLabelEmpty = () => {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].label.trim() === '') {
        return true;
      }
    }
    return false;
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleSaveTemplate = () => {
    if (isFieldLabelEmpty()) {
      toast.error('Please fill all the required field labels.');
    } else {
      setShowTable(true);

      const templateData = {
        fields: fields.map((field) => ({
          label: field.label,
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
        })
        .catch((error) => {
          console.error(error);
          toast.error('Error occurred while saving template!', {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    }
  };

  const handleResetFields = () => {
    setFields([{ label: '', type: '' }]);
    setShowTable(false);
  };

  return (
    <div>
      {showTable && (
        <div>
          <h2>Field Details</h2>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={index}>
                  <td>{field.label}</td>
                  <td>{field.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
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

        <div
          className="modal fade"
          id="exampleModalCenter"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Job Card ..
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  {fields.map((field, index) => (
                    <div key={index} className="field-container">
                      <input
                        type={field.type === 'date' ? 'date' : 'text'}
                        value={field.label}
                        onChange={(e) =>
                          handleFieldChange(index, 'label', e.target.value)
                        }
                        placeholder="Field Label"
                      />
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleFieldChange(index, 'type', e.target.value)
                        }
                      >
                        <option value="" disabled hidden>
                          Type
                        </option>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                      </select>

                      <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        onClick={() => handleRemoveField(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleResetFields}
                >
                  Reset Fields
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddField}
                >
                  Add field
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  data-dismiss="modal"
                  onClick={handleSaveTemplate}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
