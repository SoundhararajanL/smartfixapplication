import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [fields, setFields] = useState([{ label: '', type: 'text' }]);
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [showTable, setShowTable] = useState(false);

  const handleAddField = () => {
    setFields([...fields, { label: '', type: 'text' }]);
  };

  const handleFieldChange = (index, fieldProperty, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldProperty] = value;
    setFields(updatedFields);
  };

  const handleFieldLabelChange = (e) => {
    setFieldLabel(e.target.value);
  };

  const handleFieldTypeChange = (e) => {
    setFieldType(e.target.value);
  };

  const handleSaveTemplate = () => {
    setShowTable(true);
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
          className="btn btn-primary " 
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
                    <div key={index}>
                      <input
                        type="text"
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
                        <option value="text">Text</option>
                        <option value="num">Number</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddField}
                >
                  Add field
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
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
    </div>
  );
}

export default Home;
