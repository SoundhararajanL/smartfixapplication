import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faSearch, faSadTear } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Table, Pagination } from 'react-bootstrap';


const FormData = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [searchName, setSearchName] = useState('');
  const [templateNames, setTemplateNames] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [templateCounts, setTemplateCounts] = useState([]); // Initialize templateCounts state variable

  useEffect(() => {
    // Fetch template names and counts from the server
    axios
      .get('http://localhost:3000/templates')
      .then((response) => {
        const fetchedTemplates = response.data;
        const names = fetchedTemplates.map((template) => template.templateName);
        const counts = fetchedTemplates.map((template) => ({
          templateName: template.templateName,
          count: template.count,
        }));
        setTemplateNames(names);
        setTemplateCounts(counts);
      })
      .catch((error) => {
        console.error('Error fetching template names and counts:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedTemplateName) {
      const templateCount = templateCounts.find((template) => template.templateName === selectedTemplateName)?.count || 0;
      const totalPages = Math.ceil(templateCount / itemsPerPage);
      setTotalPages(totalPages);
      fetchData(selectedTemplateName, currentPage, templateCount);
    }
  }, [selectedTemplateName, currentPage, templateCounts, totalPages]);
  
  
const fetchData = (templateName, page) => {
  axios
    .get(`http://localhost:3000/templates/${templateName}/${page}`)
    .then((response) => {
      const { templates, totalPages } = response.data;

      // If the current page is greater than 1, concatenate the new templates with the existing ones
      const updatedTemplates = page > 1 ? [...selectedTemplates, ...templates] : templates;

      setTemplates(updatedTemplates);
      setSelectedTemplates(updatedTemplates);
      setShowTable(true);
      setTotalPages(totalPages);
    })
    .catch((error) => {
      console.error('Error fetching template data:', error);
    });
};
  

  const handleTemplateChange = (event) => {
    setSelectedTemplateName(event.target.value);
    setSearchValue('');
    setSearchResult([]);
    setSearchError(false);
    setCurrentPage(1); // Reset pagination when template is changed
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(selectedTemplateName, page);
  };

  const getTemplateOptions = () => {
    return templateCounts.map((template) => (
      <option key={template.templateName} value={template.templateName}>
        {template.templateName} ({template.count})
      </option>
    ));
  };
  

  
  const handleForm = () => {
    navigate('/form', { state: { loginSuccess: true } });
  };

  const handleSearch = () => {
    const searchValueLowercase = searchValue.toLowerCase().trim();
  
    const filteredTemplates = selectedTemplates.filter((template) =>
      template.fields.some((field) => {
        const fieldValue = field.value.toString().toLowerCase();
  
        // Perform an exact match search
        return fieldValue === searchValueLowercase;
      })
    );
  
    setSearchResult(filteredTemplates);
    setSearchError(
      searchValue.trim() !== "" &&
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
    if (!selectedTemplates) {
      return null;
    }
  
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

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedRows.slice(indexOfFirstItem, indexOfLastItem);
    const renderPageNumbers = () => {
      const templateCount =
        templateCounts.find((template) => template.templateName === selectedTemplateName)?.count || 0;
      const totalPages = Math.ceil(templateCount / itemsPerPage);
      const maxPageNumbersToShow = 3;
    
      if (totalPages <= 1) {
        return null; // If there is only one page or less, no need to render pagination
      }
    
    
      if (totalPages <= maxPageNumbersToShow) {
        return (
          <Pagination className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        );
      }
    
      const pageNumbersToShow = [];
      const firstPageNumber = Math.max(currentPage - 1, 1);
      const lastPageNumber = Math.min(firstPageNumber + maxPageNumbersToShow - 1, totalPages);
    
      for (let i = firstPageNumber; i <= lastPageNumber; i++) {
        pageNumbersToShow.push(
          <Pagination.Item
            key={i}
            active={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    
      return (
        <Pagination className="pagination">
          {firstPageNumber > 1 && (
            <Pagination.Prev onClick={() => handlePageChange(firstPageNumber - 1)} />
          )}
          {pageNumbersToShow}
          {lastPageNumber < totalPages && (
            <Pagination.Next onClick={() => handlePageChange(lastPageNumber + 1)} />
          )}
        </Pagination>
      );
    };
    const handleSortClick = (column) => {
      if (sortedColumn === column) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortedColumn(column);
        setSortOrder('asc');
      }
      setCurrentPage(1); // Reset to first page after sorting
    
      const sortedTemplates = sortRows(selectedTemplates); // Sort the templates based on the selected column and sort order
      setSelectedTemplates(sortedTemplates); // Update the selected templates with the sorted order
    };
    

    return (
      <>
        <div className="pagination-top-right">{renderPageNumbers()}</div>
        <Table className="center-table" bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSortClick('Serial No.')}>
                Serial No.
                {renderSortArrow('Serial No.')}
              </th>
              {templateFields.map((field) => (
                <th key={field} onClick={() => handleSortClick(field)}>
                  {field}
                  {renderSortArrow(field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((template, index) => (
                <tr key={index}>
                  <td>{serialNumbers[selectedTemplates.indexOf(template)]}</td>
                  {templateFields.map((field) => {
                    const fieldValue = template.fields.find((f) => f.field === field);
                    return <td key={field}>{fieldValue ? fieldValue.value : ''}</td>;
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={templateFields.length + 1} className="text-center">
                  No templates found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <div>
      <Button className="button-8" onClick={handleForm}>
        Back
      </Button>
      <h2 className="Form-font">Form collection</h2>

      <Form.Group controlId="templateSelect">
        <label>Select a template:</label>
        <Form.Control as="select" onChange={handleTemplateChange}>
          <option value="" hidden>
            --Form collection--
          </option>
          {getTemplateOptions()}
        </Form.Control>
      </Form.Group>
      {selectedTemplates.length > 0 && showTable && (
        <div>
          <div className="search-bar">
            <Form.Control
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search"
            />
            <Button onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </Button>
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
