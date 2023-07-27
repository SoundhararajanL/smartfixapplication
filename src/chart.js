import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import _ from 'lodash';
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

const ChartComponent = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState('bar'); // Default to bar chart
  const [ageRangeStart, setAgeRangeStart] = useState('');
  const [ageRangeEnd, setAgeRangeEnd] = useState('');
  const [filteredData, setFilteredData] = useState(null);

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
    if (isNaN(startAge) || isNaN(endAge)) {
      alert('Please enter valid age values.');
      return;
    }
  
    // Check if the age range is within the allowed range (minAge <= ageRangeStart <= ageRangeEnd <= maxAge)
    if (startAge < minAge || endAge > maxAge || startAge > endAge) {
      alert(`Invalid age range. Please enter ages between ${minAge} and ${maxAge}.`);
      return;
    }
  
    if (selectedField) {
      axios
        .get(`http://localhost:3000/api/templates/${selectedTemplate}/filtered-data`, {
          params: {
            fieldName: selectedField,
            startAge: ageRangeStart,
            endAge: ageRangeEnd,
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

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/age-range')
      .then((response) => {
        const { minAge, maxAge } = response.data;
        setMinAge(minAge);
        setMaxAge(maxAge);
      })
      .catch((error) => console.error(error));
  }, []);



  const handleChartTypeChange = (event) => {
    setSelectedChartType(event.target.value);
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
                <h2>Filter by Age Range</h2>
                <div>
                  <input
                    type="number"
                    placeholder={`Min Age: ${minAge}`}
                    value={ageRangeStart}
                    onChange={(e) => setAgeRangeStart(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder={`Max Age: ${maxAge}`}
                    value={ageRangeEnd}
                    onChange={(e) => setAgeRangeEnd(e.target.value)}
                  />
                  <button onClick={handleFilterClick}>Filter</button>
                </div>
              </div>
              








              {renderChart()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartComponent;
