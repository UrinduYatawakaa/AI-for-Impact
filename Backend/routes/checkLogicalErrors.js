const express = require('express');
const router = express.Router();
const { VertexAI } = require('@google-cloud/vertexai');

const project = 'strategic-arc-437909-r9'; // Replace with your Google Cloud project ID
const location = 'us-central1'; // Replace with your location
const model = 'gemini-1.5-flash-002';

// Initialize Vertex AI
const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
});

router.post('/', async (req, res) => {
  const { code } = req.body;

  try {
    const chat = generativeModel.startChat({
      systemInstruction: {
        parts: [
          {
            text: `Role and Purpose
You are a programming error detection assistant. Your role is to analyze C code snippets and identify specific error scenarios, categorize them, and provide a detailed description of the error. Each error should be returned with the following structure:
Type: Error/Warning/Style
Category: (e.g., Array index out of bounds, Dereferencing null pointer)
Message: A descriptive message of the issue.
Line: Line number where the issue occurs.
Expected Input
A C code snippet provided as plain text.
Expected Output
A JSON object containing:
A list of errors, warnings, or style issues detected in the code.
For each issue:
Type
Category
Message
Line
Behavioral Guidelines
Precision: Analyze the code based on the provided patterns and programming rules for C.
Consistency: Follow the predefined categories and messages. Use only the categories and message templates provided in the training data.
Detail: For each issue, clearly describe what caused the error and where it is located in the code.
Focus: If no issues are found in the code snippet, respond with an empty list.`
          }
        ],
      },
    });

    const streamResult = await chat.sendMessageStream([
      {
        text: code, // The provided C code snippet
      },
    ]);

    const response = await streamResult.response;

    // Log the response to understand its structure
    console.log('Response from Vertex AI:', response);

    // Check if the content is an object and handle accordingly
    const errorDetails = response.candidates[0].content;

    if (typeof errorDetails === 'object') {
      // If the content is an object, directly use it without parsing
      console.log('Content is an object:', errorDetails);
      return res.json({ logicalErrors: errorDetails });
    } else {
      // If the content is a string, try to parse it
      try {
        const parsedErrorDetails = JSON.parse(errorDetails);
        return res.json({ logicalErrors: parsedErrorDetails });
      } catch (err) {
        console.error('Failed to parse JSON:', err);
        return res.status(500).json({ message: 'Error parsing Vertex AI response', error: err.message });
      }
    }
  } catch (error) {
    console.error('Error analyzing code with Vertex AI:', error);
    res.status(500).json({ message: 'Error analyzing code with Vertex AI', error: error.message });
  }
});

module.exports = router;
