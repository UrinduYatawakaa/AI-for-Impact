import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './AllStudentsReports.css'; 
import AllErrorLineGraph from './AllErrorLineGraph'; // Import the ErrorLineGraph component


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AllStudentsReports = () => {
    const [allLogicalErrors, setAllLogicalErrors] = useState([]);
    const [groupedErrors, setGroupedErrors] = useState({});
    const [overallErrorTypeCount, setOverallErrorTypeCount] = useState({});
    
    // Filters state: date, time, and username
    const [fromDateTime, setFromDateTime] = useState('');
    const [toDateTime, setToDateTime] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchAllLogicalErrors = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (fromDateTime) queryParams.append('fromDateTime', fromDateTime);
                if (toDateTime) queryParams.append('toDateTime', toDateTime);
                if (username) queryParams.append('username', username);

                const response = await fetch(`http://localhost:5001/api/saveLogicalErrors/getAllLogicalErrors?${queryParams.toString()}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const errors = result.logicalErrors;

                // Group errors by student username
                const groupedByStudent = errors.reduce((acc, record) => {
                    const { username, logicalErrors } = record;
                    if (!acc[username]) {
                        acc[username] = [];
                    }
                    acc[username] = acc[username].concat(logicalErrors);
                    return acc;
                }, {});

                setGroupedErrors(groupedByStudent);

                // Calculate overall error type count
                const allErrors = errors.flatMap(record => record.logicalErrors);
                setAllLogicalErrors(allErrors);

                const typeCount = allErrors.reduce((acc, error) => {
                    acc[error.type] = acc[error.type] || {};
                    acc[error.type][error.category] = (acc[error.type][error.category] || 0) + 1;
                    return acc;
                }, {});

                setOverallErrorTypeCount(typeCount);
            } catch (error) {
                console.error('Error fetching all logical errors:', error);
            }
        };

        fetchAllLogicalErrors();
    }, [fromDateTime, toDateTime, username]); // Re-fetch data on filter change

    return (
        <div className="report-container">
            <h2>Logical Errors Report: All Students</h2>

            {/* Filters Section */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="From Date and Time"
                    value={fromDateTime}
                    onChange={(e) => setFromDateTime(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="To Date and Time"
                    value={toDateTime}
                    onChange={(e) => setToDateTime(e.target.value)}
                />
            </div>

            {/* Overall Reports Section */}
            <section>
                <h3>Distribution of Logical Errors by Type</h3>
                {Object.entries(overallErrorTypeCount).length === 0 ? (
                    <p>No logical errors recorded for the specified criteria.</p>
                ) : (
                    <div className="charts-container">
                        {Object.entries(overallErrorTypeCount).map(([errorType, categoryCounts], index) => {
                            const pieData = {
                                labels: Object.keys(categoryCounts),
                                datasets: [
                                    {
                                        label: `Error Type: ${errorType}`,
                                        data: Object.values(categoryCounts),
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.6)',
                                            'rgba(54, 162, 235, 0.6)',
                                            'rgba(255, 206, 86, 0.6)',
                                            'rgba(75, 192, 192, 0.6)',
                                            'rgba(153, 102, 255, 0.6)',
                                            'rgba(255, 159, 64, 0.6)',
                                        ],
                                        borderColor: [
                                            'rgba(255, 99, 132, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(255, 206, 86, 1)',
                                            'rgba(75, 192, 192, 1)',
                                            'rgba(153, 102, 255, 1)',
                                            'rgba(255, 159, 64, 1)',
                                        ],
                                        borderWidth: 1,
                                    },
                                ],
                            };

                            return (
                                <div key={index} className="chart-item">
                                    <h4>{`Error Type: ${errorType}`}</h4>
                                    <Pie data={pieData} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <AllErrorLineGraph  />

        </div>
    );
};

export default AllStudentsReports;
