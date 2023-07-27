import React from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class RandomFormGenerator extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const apiUrl = 'http://localhost:3000/random';
      const templateName = 'soundhar';
      const fields = [
        { field: 'Name', type: 'text' },
        { field: 'age', type: 'number', range: { NumberMin: 18, NumberMax: 50 } },
        { field: 'Emp ID', type: 'text' },
        { field: 'City', type: 'text' },
        { field: 'Email', type: 'text' },
        { field: 'Phone Number', type: 'text' },
        { field: 'Address', type: 'text' },
        { field: 'State', type: 'text' },
        { field: 'Country', type: 'text' },
        { field: 'Role/Position', type: 'text' },
        { field: 'Organization', type: 'text' },
        { field: 'Department', type: 'text' },
        { field: 'Social Media Profiles: Links', type: 'text' },
        { field: 'Interests', type: 'text' },
        { field: 'Date of Join', type: 'date', range: { startDate: '2022-08-08', endDate: null } },
        { field: 'Degree', type: 'text' },
        { field: 'Experience', type: 'number', range: { NumberMin: 1, NumberMax: 10 } },
        { field: 'Status', type: 'text' },
        { field: 'Date of Birth', type: 'date' },
      ];
  
       const batchSize = 1000; 
      const totalForms = 10000;
      const batches = Math.ceil(totalForms / batchSize);
  
      for (let i = 0; i < batches; i++) {
        const formSubmissions = fields.reduce((submissions, { field, type, range }) => {
        let value = '';

        switch (type) {
          case 'text':
            value = this.generateRandomText(field);
            break;
          case 'number':
            value = Number(this.generateRandomNumber(range));
            break;
          case 'date':
            value = this.generateRandomDate(range);
            break;
          default:
            value = '';
        }

        return {
          ...submissions,
          [field]: value
        };
      }, {});

      const form = {
        templateName,
        formSubmissions
      };

      await axios.post(apiUrl, form);
    }
  
      toast.success('Forms submitted successfully!');
    } catch (error) {
      console.error('Error submitting forms:', error);
      toast.error('Error submitting forms');
    }
  };
  
  
  generateRandomText = (field) => {
    if (field === 'Name') {
      const randomNames = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams'];
      const randomIndex = Math.floor(Math.random() * randomNames.length);
      return randomNames[randomIndex];
    }

    if (field === 'City') {
      const randomCities = ['New York', 'London', 'Paris', 'Tokyo'];
      const randomIndex = Math.floor(Math.random() * randomCities.length);
      return randomCities[randomIndex];
    }

    if (field === 'Email') {
      const randomDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
      const randomIndex = Math.floor(Math.random() * randomDomains.length);
      const username = this.generateRandomText('Name').replace(' ', '').toLowerCase();
      const domain = randomDomains[randomIndex];
      return `${username}@${domain}`;
    }

    if (field === 'Phone Number') {
      const phoneNumber = Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
      return phoneNumber;
    }

    if (field === 'State') {
      const randomStates = ['California', 'New York', 'Texas', 'Florida'];
      const randomIndex = Math.floor(Math.random() * randomStates.length);
      return randomStates[randomIndex];
    }

   

    return 'Random Text';
  };

  generateRandomNumber = (range) => {
    const { NumberMin, NumberMax } = range;
    return Math.floor(Math.random() * (NumberMax - NumberMin + 1)) + NumberMin;
  };

  generateRandomDate = (range) => {
    const { startDate, endDate } = range || {};
    const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
    const endTimestamp = endDate ? new Date(endDate).getTime() : Date.now();
    const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp;
    const randomDate = new Date(randomTimestamp);
  
    // Serialize the randomDate to a string that MongoDB understands
    return randomDate.toISOString(); // Converts to ISO 8601 format (e.g., "2023-07-20T12:00:00.000Z")
  };
  
  
  

  render() {
    return (
      <div>
        <h2>Random Form Generator</h2>
        <button onClick={this.handleSubmit}>Generate Forms</button>
        <ToastContainer />
      </div>
    );
  }
}

export default RandomFormGenerator;
