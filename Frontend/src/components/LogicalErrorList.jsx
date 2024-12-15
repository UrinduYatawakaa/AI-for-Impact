import React from 'react';

const LogicalErrorList = ({ logicalErrors }) => {
  return (
    <div className="logical-error-list">
      <h3>Logical Errors</h3>
      {logicalErrors.length === 0 ? (
        <p>No logical errors found.</p>
      ) : (
        <ul>
          {logicalErrors.map((error, index) => (
            <li key={index} className={`error-item ${error.type.toLowerCase().replace(' ', '-')}`}>
              <strong>Type:</strong> {error.type} <br />
              <strong>Category:</strong> {error.category} <br /> {/* Display category */}
              <strong>Message:</strong> {error.message} <br />
              <strong>Line:</strong> {error.line}
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .logical-error-list {
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .error-item {
          margin-bottom: 10px;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
        .error-item.warning {
          border-color: #ffcc00;
        }
        .error-item.logical-error {
          border-color: #ff6666;
        }
      `}</style> 
    </div>
  );
};

export default LogicalErrorList;
