import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ErrorLineGraph = ({ username }) => {
  const [errorData, setErrorData] = useState([]);

  useEffect(() => {
    // Fetch error data from the backend for a specific username
    const fetchErrorData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/getErrorData?username=${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setErrorData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchErrorData();
  }, [username]); // Fetch data whenever username changes

  // Function to format data for Chart.js
  const formatChartData = () => {
    const groupedByCategory = errorData.reduce((acc, curr) => {
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
      fill: false
    }));
  };

  // Helper function to get random color
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const chartData = {
    labels: errorData.map(error => error.date), // Display dates for x-axis
    datasets: formatChartData()
  };

  return (
    <div>
      <h2>Error Frequency Over Time for {username}</h2>
      {errorData.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>No error data available for {username}.</p>
      )}
    </div>
  );
};

export default ErrorLineGraph;
