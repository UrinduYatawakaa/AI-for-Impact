import React from 'react';

const ErrorList = ({ errors, comparisonErrors }) => {
  const categorizeErrors = (errors) => {
    const categories = {};
    errors.forEach(error => {
      if (!categories[error.type]) {
        categories[error.type] = [];
      }
      categories[error.type].push(error.message);
    });
    return categories;
  };

  const categorizedErrors = categorizeErrors(errors);

  return (
    <div className="errors">
      {Object.keys(categorizedErrors).length > 0 && (
        <>
          <h3>Categorized Errors:</h3>
          {Object.keys(categorizedErrors).map((type, index) => (
            <div key={index}>
              <h4>{type}:</h4>
              <ul>
                {categorizedErrors[type].map((message, i) => (
                  <li key={i}>{message}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {comparisonErrors.length > 0 && (
        <>
          <h3>Code Differences:</h3>
          <ul>
            {comparisonErrors.map((error, index) => (
              <li key={index}>
                <div style={{ color: error.added ? 'green' : 'red' }}>
                  <strong>{error.type}</strong>: {error.message}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ErrorList;
