import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AllErrorLineGraph = () => {
  const [errorData, setErrorData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [username, setUsername] = useState('');  // State to handle the username filter

  useEffect(() => {
    // Fetch error data from the backend based on the username filter
    fetch(`http://localhost:5001/api/getErrorData${username ? `?username=${username}` : ''}`)
      .then(response => response.json())
      .then(data => {
        setErrorData(data);
        filterDataByType(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [username]);  // Re-fetch data when username changes

  // Function to filter data based on the error type (Error, Warning, Style, etc.)
  const filterDataByType = (data) => {
    const groupedByType = data.reduce((acc, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = [];
      }
      acc[curr.type].push(curr);
      return acc;
    }, {});

    setFilteredData(groupedByType);
  };

  // Function to format data for Chart.js
  const formatChartData = (typeData) => {
    const groupedByCategory = typeData.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { dates: [], frequencies: [] };
      }
      acc[curr.category].dates.push(curr.date);
      acc[curr.category].frequencies.push(curr.frequency);
      return acc;
    }, {});

    return Object.entries(groupedByCategory).map(([category, data]) => ({
      label: category,
      data: data.frequencies,
      borderColor: getRandomColor(),
      fill: false,
    }));
  };

  // Helper function to get random color
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  return (
    <div>
      <h1>Error Frequency Over Time</h1>
      
      {/* Input field to filter data by username */}
      <div style={{ marginBottom: '20px' }}>
        <label>Filter by Username: </label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      
      {Object.keys(filteredData).map((type, index) => (
        <div key={index} style={{ margin: '30px 0' }}>
          <h2>{type} Errors</h2>
          <Line
            data={{
              labels: filteredData[type].map(error => error.date),
              datasets: formatChartData(filteredData[type]),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AllErrorLineGraph;

