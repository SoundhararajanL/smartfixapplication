import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import _ from 'lodash';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const ChartComponent = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState('bar'); // Default to bar chart
  const [ageRangeStart, setAgeRangeStart] = useState('');
  const [ageRangeEnd, setAgeRangeEnd] = useState('');
  const [startDateOfJoin, setStartDateOfJoin] = useState('');
  const [endDateOfJoin, setEndDateOfJoin] = useState('');
  const [startDateOfBirth, setStartDateOfBirth] = useState('');
  const [endDateOfBirth, setEndDateOfBirth] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const vibrantColors = [
    '#16FCF9',
    '#A4FA73',
    '#49B7FF',
    '#DB9EDF',
    '#FFEA84',
    '#FC9FBD',
    '#A380E0',
    // Add more vibrant colors as needed.
  ];

  const generateRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * vibrantColors.length);
    return vibrantColors[randomIndex];
  };
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/templates')
      .then((response) => {
        const uniqueTemplates = [...new Set(response.data.map((template) => template.templateName))];
        setTemplates(uniqueTemplates);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleTemplateChange = (event) => {
    const selectedTemplateName = event.target.value;
    setSelectedTemplate(selectedTemplateName);
    setFields([]);
    setSelectedField(null);
    setChartData(null);
    setFilteredData(null);

    axios
      .get(`http://localhost:3000/api/templates/${selectedTemplateName}/fields`)
      .then((response) => setFields(response.data))
      .catch((error) => console.error(error));
  };

  const handleFieldChange = (event) => {
    const selectedFieldName = event.target.value;
    setSelectedField(selectedFieldName);
    setAgeRangeStart('');
    setAgeRangeEnd('');
    setFilteredData(null);

    axios
      .get(`http://localhost:3000/api/templates/${selectedTemplate}/data/${selectedFieldName}`)
      .then((response) => {
        console.log('API Response:', response.data);

        const labels = Object.keys(response.data);
        const values = Object.values(response.data);
        const colors = values.map(() => generateRandomColor());

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `Count of People for each ${selectedFieldName}`,
              data: values,
              backgroundColor: colors,
              borderColor: 'rgba(226, 213, 148 , 1)',
              borderWidth: 1,
            },
          ],

        });

        setFilteredData(response.data);

      })
      .catch((error) => console.error(error));
  };
  const handleFilterClick = () => {
    // Convert ageRangeStart and ageRangeEnd to numbers
    const startAge = parseInt(ageRangeStart);
    const endAge = parseInt(ageRangeEnd);
  
    // Check if ageRangeStart and ageRangeEnd are valid numbers
    // if (isNaN(startAge) || isNaN(endAge)) {
    //   alert('Please enter valid age values.');
    //   return;
    // }
  
    // Check if the age range is within the allowed range (minAge <= ageRangeStart <= ageRangeEnd <= maxAge)
    if (startAge < minAge || endAge > maxAge || startAge > endAge) {
      alert(`Invalid age range. Please enter ages between ${minAge} and ${maxAge}.`);
      return;
    }
  
    if (selectedField) {
      // Validate date range values for Date of Join
      const startDate = new Date(startDateOfJoin);
      const endDate = new Date(endDateOfJoin);
      const minDateOfJoin = new Date(minJoin);
      const maxDateOfJoin = new Date(maxJoin);
  
      if (startDate.getTime() > endDate.getTime()) {
        alert("Invalid date range for Date of Join. Start date cannot be after end date.");
        return;
      }
  
      if (startDate.getTime() < minDateOfJoin.getTime() || endDate.getTime() > maxDateOfJoin.getTime()) {
        alert(`Invalid date range for Date of Join. Allowed range: ${minJoin} to ${maxJoin}`);
        return;
      }
  
      axios
        .get(`http://localhost:3000/api/templates/${selectedTemplate}/filtered-data`, {
          params: {
            fieldName: selectedField,
            startAge: ageRangeStart,
            endAge: ageRangeEnd,
            startDateOfJoin: startDateOfJoin,
            endDateOfJoin: endDateOfJoin,
            startDateOfBirth: startDateOfBirth,
            endDateOfBirth: endDateOfBirth,
          },
        })
        .then((response) => {
          const data = response.data;
          console.log('Filtered Data:', data); // Log the filtered data
  
          // Sort the data based on labels (names) in ascending order
          const sortedData = _.sortBy(Object.entries(data), ([name]) => name);
          const sortedLabels = sortedData.map(([name, value]) => name);
          const sortedValues = sortedData.map(([name, value]) => value);
          const colors = sortedValues.map(() => generateRandomColor());
  
          setChartData({
            labels: sortedLabels,
            datasets: [
              {
                label: `Count of People aged ${ageRangeStart} to ${ageRangeEnd}`,
                data: sortedValues,
                backgroundColor: colors,
                borderColor: 'rgba(226, 213, 148 , 1)',
                borderWidth: 1,
              },
            ],
          });
        })
        .catch((error) => console.error(error));
    }
  };
  

  const [minAge, setMinAge] = useState(null);
  const [maxAge, setMaxAge] = useState(null);
  const [minJoin, setMinJoin] = useState(null);
  const [maxJoin, setMaxJoin] = useState(null);
  const [minBirth, setMinBirth] = useState(null);
  const [maxBirth, setMaxBirth] = useState(null);



  useEffect(() => {
    axios
      .get('http://localhost:3000/api/age-range')
      .then((response) => {
        const { minAge, maxAge } = response.data;
        setMinAge(minAge);
        setMaxAge(maxAge);
      })
      .catch((error) => console.error(error));

    axios
      .get('http://localhost:3000/date-of-join-range')
      .then((response) => {
        const { minDateOfJoin, maxDateOfJoin } = response.data;
        setMinJoin(minDateOfJoin); // Store as is (no need to format)
        setMaxJoin(maxDateOfJoin); // Store as is (no need to format)
      })
      .catch((error) => console.error(error));

    axios
      .get('http://localhost:3000/date-of-birth-range')
      .then((response) => {
        const { minDateOfBirth, maxDateOfBirth } = response.data;
        setMinBirth(minDateOfBirth); // Store as is (no need to format)
        setMaxBirth(maxDateOfBirth); // Store as is (no need to format)
      })
      .catch((error) => console.error(error));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
 

  const handleChartTypeChange = (event) => {
    setSelectedChartType(event.target.value);
  };
  const handleFilterHeaderClick = () => {
    setShowAgeFilter(!showAgeFilter);
    if (!showAgeFilter) {
      clearDateFilters();
      clearDateOfBirthFilters();
    }
  };

  const handleDateFilterClick = () => {
    // Validate date range values for Date of Join
    if (startDateOfJoin && endDateOfJoin) {
      const startDate = new Date(startDateOfJoin);
      const endDate = new Date(endDateOfJoin);
      const minDateOfJoin = new Date(minJoin);
      const maxDateOfJoin = new Date(maxJoin);
  
      if (startDate.getTime() > endDate.getTime()) {
        alert("Invalid date range for Date of Join. Start date cannot be after end date.");
        return;
      }
  
      if (startDate.getTime() < minDateOfJoin.getTime() || endDate.getTime() > maxDateOfJoin.getTime()) {
        alert(`Invalid date range for Date of Join. Allowed range: ${minJoin} to ${maxJoin}`);
        return;
      }
    }
  
    // Validate date range values for Date of Birth
    if (startDateOfBirth && endDateOfBirth) {
      const startDate = new Date(startDateOfBirth);
      const endDate = new Date(endDateOfBirth);
      const minDateOfBirth = new Date(minBirth);
      const maxDateOfBirth = new Date(maxBirth);
  
      if (startDate.getTime() > endDate.getTime()) {
        alert("Invalid date range for Date of Birth. Start date cannot be after end date.");
        return;
      }
  
      if (startDate.getTime() < minDateOfBirth.getTime() || endDate.getTime() > maxDateOfBirth.getTime()) {
        alert(`Invalid date range for Date of Birth. Allowed range: ${minBirth} to ${maxBirth}`);
        return;
      }
    }
  
    handleFilterClick();
  
    // Auto-close the modal after applying the filter
    toggleModal();
  };
  
  
  
  
  

  const clearDateFilters = () => {
    setStartDateOfJoin('');
    setEndDateOfJoin('');
  };

  const clearDateOfBirthFilters = () => {
    setStartDateOfBirth('');
    setEndDateOfBirth('');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const renderChart = () => {
    switch (selectedChartType) {
      case 'bar':
        return (
          <div style={{ flex: 1, padding: '10px', height: '400px', width: '600px' }}>
            <h2>Bar Chart</h2>
            <Bar
              data={chartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                      },
                    },
                  ],
                },
              }}
            />
          </div>
        );
      case 'line':
        return (
          <div style={{ flex: 1, padding: '10px', height: '400px', width: '600px' }}>
            <h2>Line Chart</h2>
            <Line
              data={chartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                      },
                    },
                  ],
                },
                elements: {
                  line: {
                    fill: false,
                  },
                },
              }}
            />
          </div>
        );
      case 'pie':
        return (
          <div style={{ flex: 1, padding: '10px', height: '400px', width: '600px' }}>
            <h2>Pie Chart</h2>
            <Pie
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div>
      <h2>Select a template:</h2>
      <select onChange={handleTemplateChange}>
        <option value="" hidden>Select a template</option>
        {templates.map((template, index) => (
          <option key={index} value={template}>
            {template}
          </option>
        ))}
      </select>

      {selectedTemplate && (
        <div>
          <h2>Select a field:</h2>
          <select onChange={handleFieldChange}>
            <option value="" hidden>Select a field</option>
            {fields.map((field, index) => (
              <option key={index} value={field}>
                {field}
              </option>
            ))}
          </select>

          {selectedField && chartData && (
            <div style={{ display: 'flex', marginRight: '20%' }}>
              <div style={{ flex: 1, padding: '10px' }}>
                <h2>Chart Type</h2>
                <select onChange={handleChartTypeChange}>
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>

              <div style={{ flex: 1, padding: '10px' }}>
                <h2 onClick={toggleModal}>Filter</h2>
                {/* The modal */}
                <Modal show={showModal} onHide={toggleModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Filter Options</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* Add your filter inputs here */}
                    <h6>Age {minAge} to {maxAge}</h6>
                    <input
                      type="number"
                      placeholder={`required : ${minAge}`}
                      value={ageRangeStart}
                      onChange={(e) => setAgeRangeStart(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder={`required : ${maxAge}`}
                      value={ageRangeEnd}
                      onChange={(e) => setAgeRangeEnd(e.target.value)}
                    />

                    <h6>Date of Join {minJoin} to {maxJoin}</h6>
                    <input
                      type="date"
                      value={startDateOfJoin}
                      onChange={(e) => setStartDateOfJoin(e.target.value)}
                    />
                    <input
                      type="date"
                      value={endDateOfJoin}
                      onChange={(e) => setEndDateOfJoin(e.target.value)}
                    />

                    <h6>Date of Birth {minBirth} to {maxBirth}</h6>
                    <input
                      type="date"
                      value={startDateOfBirth}
                      onChange={(e) => setStartDateOfBirth(e.target.value)}
                    />
                    <input
                      type="date"
                      value={endDateOfBirth}
                      onChange={(e) => setEndDateOfBirth(e.target.value)}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    {/* Add the Clear buttons here */}
                    <Button variant="secondary" onClick={clearDateFilters}>
                      Clear Date of Join
                    </Button>
                    <Button variant="secondary" onClick={clearDateOfBirthFilters}>
                      Clear Date of Birth
                    </Button>
                    <Button variant="secondary" onClick={toggleModal}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleDateFilterClick}>
                      Apply Filter
                    </Button>
                  </Modal.Footer>
                </Modal>

              </div>

              {renderChart()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChartComponent;