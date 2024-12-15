import React, { useState, useRef } from 'react';
import CodeEditor from './CodeEditor';
import { useNavigate } from 'react-router-dom';
import './CodeEditorContainer.css'; // Importing external CSS for cleaner styling (optional)

const files = {
  "script.c": {
    name: 'script.c',
    language: 'c',
    value: '#include <stdio.h>\nint main() {\n    printf("Hello, World!");\n    return 0;\n}'
  },
  "index.html": {
    name: 'index.html',
    language: 'html',
    value: '<div> </div>'
  }
};

const CodeEditorContainer = ({ username, userId }) => {
  const [fileName, setFileName] = useState("script.c");
  const [errors, setErrors] = useState([]);
  const [comparisonErrors, setComparisonErrors] = useState([]);
  const [logicalErrors, setLogicalErrors] = useState([]); // State for storing logical errors

  const navigate = useNavigate();

  const navigateToReport = () => {
    navigate('/report'); // Navigate to the report page
  };

  const editorRef = useRef(null);

  function handleEditorMount(editor) {
    editorRef.current = editor;
  }

  // Function to check for logical errors
  async function checkLogicalErrors() {
    try {
      const code = editorRef.current.getValue();
      const response = await fetch('http://localhost:5001/api/checkLogicalErrors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setLogicalErrors(result.logicalErrors); // Update the state with logical errors
    } catch (error) {
      console.error('Error checking logical errors:', error);
    }
  }

  return (
    <div className='container'>
      <div className='header'>
        <button className='switch-button' onClick={() => setFileName("index.html")}>
          Switch to index.html
        </button>
        <button className='switch-button' onClick={() => setFileName("script.c")}>
          Switch to script.c
        </button>
        <button className='report-button' onClick={navigateToReport}>Check My Report</button>
      </div>
      <div className='editor-container'>
        <CodeEditor
          fileName={fileName}
          files={files}
          onEditorMount={handleEditorMount}
          username={username}
          userId={userId}
        />
      </div>
      <div className='footer'>
        <p>Logged in as: {username} (ID: {userId})</p>
      </div>
    </div>
  );
};

export default CodeEditorContainer;
