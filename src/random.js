import React from 'react';
import axios from 'axios';

class RandomFormGenerator extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const apiUrl = 'http://localhost:3000/form'; // Replace with your API endpoint
      const templateName = 'soundhar';
      const fields = [
        { field: 'Name', type: 'text' },
        { field: 'Age', type: 'number', range: { NumberMin: 18 } },
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

      const forms = Array.from({ length: 100 }, () => {
        const formValues = fields.map(({ field, type, range }) => {
          let value = '';

          switch (type) {
            case 'text':
              value = this.generateRandomText();
              break;
            case 'number':
              value = this.generateRandomNumber(range);
              break;
            case 'date':
              value = this.generateRandomDate(range);
              break;
            default:
              value = '';
          }

          return { field, value };
        });

        return { templateName, fields: formValues };
      });

      await Promise.all(
        forms.map(async (form) => {
          await axios.post(apiUrl, form);
        })
      );

      console.log('Forms submitted successfully!');
      // Display a success message to the user (e.g., using a toast library)
    } catch (error) {
      console.error('Error submitting forms:', error);
      // Display an error message to the user
    }
  };

  generateRandomText = () => {
    // Generate a random text value
    return 'Random Text';
  };

  generateRandomNumber = (range) => {
    // Generate a random number within the given range
    const { NumberMin, NumberMax } = range;
    return String(Math.floor(Math.random() * (NumberMax - NumberMin + 1)) + NumberMin);
  };
  

  generateRandomDate = (range) => {
    // Generate a random date within the given range, or a random date if range is undefined
    const { startDate, endDate } = range || {};
    const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
    const endTimestamp = endDate ? new Date(endDate).getTime() : Date.now();
    const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp;
    return new Date(randomTimestamp).toISOString().split('T')[0];
  };

  render() {
    return (
      <div>
        <h2>Random Form Generator</h2>
        <button onClick={this.handleSubmit}>Generate Forms</button>
      </div>
    );
  }
}

export default RandomFormGenerator;
