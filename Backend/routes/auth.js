const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password }); // Store plain text password
    await newUser.save();
    res.status(201).send('User created successfully!');
  } catch (error) {
    res.status(400).send('Error creating user: ' + error.message);
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await User.findOne({ username });

      if (!user || user.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token (replace with your token generation logic)
      const token = 'your_jwt_token'; // Example token generation
      
      // Send user data in response
      return res.json({
          token,
          user: {
              username: user.username,
              _id: user._id,
          }
      });
  } catch (error) {
      return res.status(500).json({ message: 'Server error: ' + error.message });
  }
});


module.exports = router;
