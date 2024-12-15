import React from 'react';
import { Link } from 'react-router-dom';

const LecturerDashboard = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lecturer Dashboard</h1>
      <div style={styles.buttonContainer}>
        <Link to="/all-students-reports" style={styles.link}>
          <button style={styles.button}>View All Students' Logical Error Reports</button>
        </Link>
        <Link to="/suggestions" style={styles.link}>
          <button style={styles.button}>Add Suggestions for Error Scenarios</button>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '80%',
    margin: '20px auto',
    textAlign: 'center',
    maxWidth: '1000px',
  },
  title: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  link: {
    textDecoration: 'none', // Remove default link underline
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s ease',
    width: '250px',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
};

export default LecturerDashboard;
