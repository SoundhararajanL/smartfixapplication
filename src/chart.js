import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const ChartComponent = () => {
  const [formsCounts, setFormsCounts] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch data from the server
    fetch('http://localhost:3000/templateCounts')
      .then(response => response.json())
      .then(data => setFormsCounts(data))
      .catch(error => console.error('Error fetching forms counts:', error));
  }, []);

  useEffect(() => {
    // Create the chart when the data is available
    if (formsCounts.length > 0 && chartRef.current) {
      const formsNames = formsCounts.map(item => item._id);
      const counts = formsCounts.map(item => item.count);

      const ctx = chartRef.current.getContext('2d');

      if (chartRef.current.chart) {
        chartRef.current.chart.destroy(); // Reset the existing chart
      } 

      // Custom colors for the charts
      const colors = [
        'rgba(75, 192, 192, 0.6)',
  'rgba(192, 75, 75, 0.6)',
  'rgba(75, 192, 75, 0.6)',
  'rgba(192, 192, 75, 0.6)',
  'rgba(75, 75, 192, 0.6)',
        
      ];

      // Create the selected chart
      if (selectedChartType === 'line') {
        chartRef.current.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: formsNames,
            datasets: [{
              label: 'Forms Counts',
              data: counts,
              backgroundColor: colors[0],
              borderColor: colors[0],
              borderWidth: 1,
            }],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else if (selectedChartType === 'bar') {
        chartRef.current.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: formsNames,
            datasets: [{
              label: 'Forms Counts',
              data: counts,
              backgroundColor: colors, // Apply different colors to each bar
              borderColor: colors,
              borderWidth: 1,
            }],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else if (selectedChartType === 'pie') {
        chartRef.current.chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: formsNames,
            datasets: [{
              data: counts,
              backgroundColor: colors, // Apply different colors to each slice
              borderColor: colors,
              borderWidth: 1,
            }],
          },
        });
      }
    }
  }, [formsCounts, selectedChartType]);

  const handleChartTypeChange = (event) => {
    setSelectedChartType(event.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="chartType">Select Chart Type:</label>
        <select id="chartType" value={selectedChartType} onChange={handleChartTypeChange}>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div style={{ width: '50%', height: '50%', marginLeft:'10%' , marginTop:'10%' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;
