const express = require('express');
const LogicalError = require('../models/LogicalError');
const router = express.Router();

// Define the route to get error data grouped by categories and timestamps
router.get('/', async (req, res) => {
    const { username } = req.query;

    try {
      // Create a query object for filtering based on username if provided
      const query = username ? { username } : {};
  
      const errors = await LogicalError.aggregate([
        { $match: query }, // Match based on username if provided
        { $unwind: '$logicalErrors' },
        {
          $group: {
            _id: {
              category: '$logicalErrors.category',
              type: '$logicalErrors.type',
              date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
            },
            frequency: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            category: '$_id.category',
            type: '$_id.type',
            date: '$_id.date',
            frequency: 1
          }
        },
        { $sort: { date: 1 } }
      ]);
  
      res.json(errors);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
