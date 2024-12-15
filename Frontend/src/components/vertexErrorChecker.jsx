import { VertexAI } from '@google-cloud/vertexai';

const vertex_ai = new VertexAI({
  project: 'strategic-arc-437909-r9', // Replace with your project ID
  location: 'us-central1', // Update to your region if needed
});

const model = 'gemini-1.5-flash-002'; // Chosen generative model

// Configure the generative model
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' },
  ],
  systemInstruction: {
    parts: [
      {
        text: `Role and Purpose:
You are a programming error detection assistant. Your role is to analyze C code snippets and identify specific error scenarios, categorize them, and provide a detailed description of the error.

Each error should be returned with the following structure:
- Type: Error/Warning/Style
- Category: (e.g., Array index out of bounds, Dereferencing null pointer)
- Message: A descriptive message of the issue.
- Line: Line number where the issue occurs.

Expected Input:
A C code snippet provided as plain text.

Expected Output:
A JSON object containing a list of errors, warnings, or style issues detected in the code. For each issue:
- Type
- Category
- Message
- Line

Behavioral Guidelines:
- Precision: Analyze the code based on the provided patterns and programming rules for C.
- Consistency: Follow the predefined categories and messages.
- Detail: For each issue, clearly describe what caused the error and where it is located in the code.
- Focus: If no issues are found in the code snippet, respond with an empty list.`,
      },
    ],
  },
});

// Function to analyze code
const analyzeCode = async (code) => {
  const chat = generativeModel.startChat({});
  try {
    const streamResult = await chat.sendMessageStream([{ text: code }]);
    const response = (await streamResult.response).candidates[0].content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error analyzing code with Vertex AI:', error);
    throw error;
  }
};

export default analyzeCode;
