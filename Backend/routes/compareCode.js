const express = require('express');
const router = express.Router();
const diff = require('diff');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Example reference code
const referenceCode = `#include <stdio.h>
int main() {
    printf("Hello, World!");
    return 0;
}`;

router.post('/', (req, res) => {
  const { code } = req.body;

  // Compare code with reference solution
  const result = compareAndCategorizeCode(code, referenceCode);

  res.json(result);
});

const compareAndCategorizeCode = (studentCode, referenceCode) => {
  const comparisonErrors = [];
  const categorizedErrors = [];

  // Compare code with reference
  const differences = diff.diffLines(referenceCode, studentCode);

  differences.forEach((part) => {
    if (part.added || part.removed) {
      // Only categorize errors on lines that differ
      const categorizedPartErrors = categorizeSpecificErrors(part.value);
      comparisonErrors.push({
        type: part.added ? 'Mismatch' : 'Missing',
        message: part.value,
        added: part.added,
        removed: part.removed
      });
      categorizedErrors.push(...categorizedPartErrors);
    }
  });

  return {
    comparisonErrors,
    categorizedErrors
  };
};

const categorizeSpecificErrors = (codeSegment) => {
  const categorizedErrors = [];

  // Define patterns for common errors
  const patterns = [
    { type: 'Missing Semicolons', pattern: /[^;]\s*\n/g },
    { type: 'Uninitialized Variables', pattern: /\b(int|float|char|double)\s+[a-zA-Z_]\w*\s*(?!=.*=\s*[^;])/g },
    { type: 'Mismatched Braces', pattern: /{[^{}]*[^{}]*(}|[^{}]*{)/g },
    { type: 'Incorrect Use of scanf', pattern: /scanf\s*\(\s*[^%]*\s*[^&]/g },
    { type: 'Buffer Overflow', pattern: /gets\s*\(/g },
    { type: 'Off-by-One Errors', pattern: /for\s*\(.*i\s*=\s*1\s*;\s*i\s*<\s*.*;\s*i\+\+\)/g },
    { type: 'Incorrect Pointer Usage', pattern: /[*]\s*[a-zA-Z_]\w*\s*(=|[\s\+\-\*\/]*[^\s\+\-\*\/]*)[^&|[|\]]/g },
    { type: 'Not Checking for Null Pointers', pattern: /[^if\s*]*\s*==\s*NULL/g },
    { type: 'Using Uninitialized Pointers', pattern: /[\*\s][a-zA-Z_]\w*\s*(?!=.*=\s*[^;])/g },
    { type: 'Misusing Memory Allocation Functions', pattern: /malloc\s*\(.*\)\s*[^;]*\s*(?!free\s*\()/g },
    { type: 'Confusing Assignment with Comparison', pattern: /=\s*\d+/g },
    { type: 'Not Understanding Data Types', pattern: /[\w]+\s*=\s*[\w]*\s*[^int|float|char|double]/g },
    { type: 'Ignoring Compiler Warnings', pattern: /#pragma\s+warning/g },
    { type: 'Not Following Proper Coding Conventions', pattern: /[^ ]{2,}/g } // Simplistic pattern for conventions
  ];

  // Check code against patterns
  patterns.forEach(({ type, pattern }) => {
    const matches = codeSegment.match(pattern);
    if (matches) {
      matches.forEach(match => {
        categorizedErrors.push({ type, message: `Potential issue found: ${match.trim()}` });
      });
    }
  });

  return categorizedErrors;
};

module.exports = router;
