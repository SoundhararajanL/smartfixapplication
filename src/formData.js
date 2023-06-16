import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faSearch, faSadTear, } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const FormData = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
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
    setSearchName('');
    setSearchResult([]);
    setSearchError(false);
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

  const handleSearch = () => {
    const filteredTemplates = selectedTemplates.filter((template) =>
      template.fields.some((field) =>
        field.field.toLowerCase() === 'name' && field.value.toLowerCase() === searchName.toLowerCase()
      )
    );
    setSearchResult(filteredTemplates);
    setSearchError(
      searchName.trim() !== '' &&
      filteredTemplates.length === 0 &&
      selectedTemplates.length > 0
    );
  };

  const handleColumnClick = (column) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortOrder('asc');
    }
  };
  const sortRows = (rows) => {
    if (!sortedColumn) {
      return rows;
    }
  
    const sortedRows = [...rows];
  
    sortedRows.sort((a, b) => {
      const fieldA = a.fields.find((f) => f.field === sortedColumn)?.value;
      const fieldB = b.fields.find((f) => f.field === sortedColumn)?.value;
  
      if (fieldA === undefined || fieldB === undefined) {
        return 0;
      }
  
      if (!isNaN(fieldA) && !isNaN(fieldB)) {
        // Both values are numeric
        const numA = parseFloat(fieldA);
        const numB = parseFloat(fieldB);
  
        if (sortOrder === 'asc') {
          return numA - numB;
        } else {
          return numB - numA;
        }
      } else {
        // At least one value is non-numeric
        if (sortOrder === 'asc') {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      }
    });
  
    return sortedRows;
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

    const rowsToShow = searchResult.length > 0 ? searchResult : selectedTemplates;
    const sortedRows = sortRows(rowsToShow);

    return (
      <table className="center-table">
        <thead className="thead">
          <tr>
            {templateFields.map((field) => (
              <th key={field} onClick={() => handleColumnClick(field)}>
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tbody">
          {sortedRows.length > 0 ? (
            sortedRows.map((template, index) => (
              <tr key={index}>
                {templateFields.map((field) => {
                  const fieldValue = template.fields.find((f) => f.field === field);
                  return <td key={field}>{fieldValue ? fieldValue.value : ''}</td>;
                })}
              </tr>
            ))
          ) : null}
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
        <div>
          <div className="search-bar">
            <input
              type="text"
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
              placeholder="Search by name"
            />
            <button onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          {searchError ? (
            <div className="not-found">
              <FontAwesomeIcon icon={faSadTear} bounce className="sad-icon" />
              <p>User name not found</p>
            </div>
          ) : (
            <div className="horizontal-tables">
              <div className="table-container">{renderTemplateTable()}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormData;
