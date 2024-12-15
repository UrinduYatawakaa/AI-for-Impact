const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

router.post('/', (req, res) => {
  const { code } = req.body;
  const filePath = path.join(__dirname, '../temp.c');

  // Save the code to a temporary file
  fs.writeFileSync(filePath, code);

  // Run clang to check for errors
  exec(`clang -fsyntax-only ${filePath}`, (error, stdout, stderr) => {
    fs.unlinkSync(filePath); // Remove the temporary file

    let errors = [];
    if (stderr) {
      errors = stderr.split('\n').filter(line => line.trim() !== '').map(line => categorizeError(line));
    }

    res.json({ errors });
  });
});

const categorizeError = (errorLine) => {
  const regex = /^(.*):(\d+):(\d+): (warning|error): (.*)$/;
  const match = regex.exec(errorLine);
  
  if (!match) {
    return { type: 'Unknown', message: errorLine, line: 0, column: 0 };
  }

  const [_, file, line, column, level, message] = match;

  let type;
  if (level === 'error') {
    if (message.includes('expected') || message.includes('undeclared')) {
      type = 'Syntax Error';
    } else {
      type = 'Semantic Error';
    }
  } else {
    type = 'Warning';
  }

  return { type, message, line: parseInt(line, 10), column: parseInt(column, 10) };
};

module.exports = router;
