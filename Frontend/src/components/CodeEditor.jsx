import React, { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios'; // For making HTTP requests

const CodeEditor = ({ fileName, files, onEditorMount,username, userId }) => {
  const editorRef = useRef(null);
  const [errors, setErrors] = useState([]); // State to hold logical errors
  const [code, setCode] = useState(""); // State to store the code from the editor
  const file = files[fileName];

  // Handle when the editor is mounted
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    if (onEditorMount) {
      onEditorMount(editor);
    }
  }

  // Send the code to the backend for error analysis
  const analyzeCode = async (code) => {
    try {
      console.log("Sending code for analysis:", code); // Log the code being sent

      const response = await axios.post('http://localhost:5001/api/checkLogicalErrors', { code }); // Replace with your backend API endpoint
      console.log("Response received from backend:", response.data); // Log the full response

      const { logicalErrors } = response.data;
      
      if (logicalErrors && logicalErrors.parts) {
        // Parse the JSON inside the 'text' key of each part
        const parsedErrors = logicalErrors.parts.flatMap(part => {
          try {
            console.log("Raw error part:", part.text); // Log the raw text part

            const parsed = JSON.parse(part.text.replace(/```json|```/g, '').trim());
            console.log("Parsed error JSON:", parsed); // Log the parsed JSON

            return parsed.errors || []; // Extract the 'errors' array if it exists
          } catch (e) {
            console.error('Error parsing logical errors:', e);
            return [];
          }
        });

        console.log("Parsed logical errors:", parsedErrors); // Log the parsed logical errors
        setErrors(parsedErrors);
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
      setErrors([{ Message: 'Failed to analyze code. Please try again.' }]);
    }
  };

  // Handle editor value change
  const handleEditorChange = (value, event) => {
    setCode(value); // Update the code state when editor content changes
  };

  // Handle the "Check Errors" button click
  const handleCheckErrors = () => {
    if (code) {
      analyzeCode(code); // Send the code to backend on button click
    }
  };

  return (
    <div>
      <Editor
        height="400px"
        width="100%"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        onChange={handleEditorChange} // Update state on editor change
      />

      {/* Button to manually trigger error checking */}
      <button onClick={handleCheckErrors} style={{ marginTop: '10px' }}>
        Check Errors
      </button>

      <div>
        {/* Display errors if any */}
        <div>

          <h3>Detected Logical Errors:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>Type:</strong> {error.Type || 'N/A'} <br />
                <strong>Category:</strong> {error.Category || 'N/A'} <br />
                <strong>Message:</strong> {error.Message || 'N/A'} <br />
                <strong>Line:</strong> {error.Line || 'N/A'} <br />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
