import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faSearch, faSadTear } from '@fortawesome/free-solid-svg-icons';
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
  const [serialNumbers, setSerialNumbers] = useState([]);


  useEffect(() => {
    // Fetch templates from MongoDB collection
    axios
    .get('http://localhost:3000/formdata')
    .then((response) => {
      const fetchedTemplates = response.data;
      setTemplates(fetchedTemplates);

      // Generate serial numbers for each template
      const serials = fetchedTemplates.map((_, index) => index + 1);
      setSerialNumbers(serials);
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
      template.fields.some(
        (field) =>
          field.field.toLowerCase() === 'name' &&
          field.value.toLowerCase() === searchName.toLowerCase()
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
      let fieldA, fieldB;

      if (sortedColumn === 'Serial No.') {
        fieldA = serialNumbers[selectedTemplates.indexOf(a)];
        fieldB = serialNumbers[selectedTemplates.indexOf(b)];
      } else {
        fieldA = a.fields.find((f) => f.field === sortedColumn)?.value;
        fieldB = b.fields.find((f) => f.field === sortedColumn)?.value;
      }

      if (fieldA === undefined || fieldB === undefined) {
        // Handle empty values
        if (fieldA === undefined && fieldB === undefined) {
          return 0; // Both values are empty, consider them equal
        } else if (fieldA === undefined) {
          return sortOrder === 'asc' ? 1 : -1; // Empty values come after non-empty values
        } else {
          return sortOrder === 'asc' ? -1 : 1; // Empty values come before non-empty values
        }
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
  
    const renderSortArrow = (column) => {
      if (sortedColumn === column) {
        return (
          <FontAwesomeIcon
            icon={sortOrder === 'asc' ? faChevronUp : faChevronDown}
            className="sort-arrow"
          />
        );
      }
      return null;
    };
  
    return (
      <table className="center-table">
        <thead className="thead">
          <tr>
            <th onClick={() => handleColumnClick('Serial No.')}>
              Serial No.
              {renderSortArrow('Serial No.')}
            </th>
            {templateFields.map((field) => (
              <th key={field} onClick={() => handleColumnClick(field)}>
                {field}
                {renderSortArrow(field)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tbody">
          {sortedRows.length > 0 ? (
            sortedRows.map((template, index) => (
              <tr key={index}>
                <td>{serialNumbers[selectedTemplates.indexOf(template)]}</td>
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
