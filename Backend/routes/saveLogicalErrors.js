
// routes/saveLogicalErrors.js
const express = require('express');
const router = express.Router();
const LogicalError = require('../models/LogicalError');

// Route to save logical errors for each student
router.post('/', async (req, res) => {
  const { username, userId, logicalErrors } = req.body;

  try {
    // Validate input
    if (!username || !userId || !logicalErrors.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new logical error record
    const newLogicalError = new LogicalError({
      userId,
      username,
      logicalErrors
    });

    // Save the record to the database
    await newLogicalError.save();

    res.status(201).json({ message: 'Logical errors saved successfully' });
  } catch (error) {
    console.error('Error saving logical errors:', error);
    res.status(500).json({ message: 'Error saving logical errors' });
  }
});

// Route to retrieve logical errors for a specific user
router.get('/getLogicalErrors', async (req, res) => {
  const { username, fromDate } = req.query;

  try {
    // Parse the fromDate query parameter to a JavaScript Date object
    const parsedFromDate = fromDate ? new Date(fromDate) : null;

    // Fetch logical errors from the database
    const logicalErrors = await LogicalError.find({
      username,
      ...(parsedFromDate && { timestamp: { $gte: parsedFromDate } }) // Filter by timestamp if fromDate is provided
    });

    res.json({ logicalErrors });
  } catch (error) {
    console.error('Error fetching logical errors:', error);
    res.status(500).json({ message: 'Internal Server Error: ' + error.message });
  }
});


// Route to retrieve logical errors for all students with filtering
router.get('/getAllLogicalErrors', async (req, res) => {
  const { fromDate, toDate, username } = req.query;

  try {
      const query = {};

      // Filter by username if provided
      if (username) {
          query.username = username;
      }

      // Filter by date range if provided
      if (fromDate || toDate) {
          query.timestamp = {};
          if (fromDate) {
              query.timestamp.$gte = new Date(fromDate);
          }
          if (toDate) {
              query.timestamp.$lte = new Date(toDate);
          }
      }

      const logicalErrors = await LogicalError.find(query); // Fetch filtered records
      res.json({ logicalErrors });
  } catch (error) {
      console.error('Error fetching all students\' logical errors:', error);
      res.status(500).json({ message: 'Internal Server Error: ' + error.message });
  }
});


module.exports = router;
