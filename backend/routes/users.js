const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.session.token || (req.cookies && req.cookies.token) || req.headers['x-access-token'];
  
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    next();
  });
};

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password') // Exclude password from the response
      .lean(); // Convert to plain JavaScript object

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user dashboard data (protected route)
router.get('/:userId/dashboard', verifyToken, async (req, res) => {
  try {
    // Check if user is accessing their own dashboard
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to access this dashboard' });
    }

    // Fetch user's data including their comparisons
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // You can add more data fetching here (comparisons, activities, etc.)
    const userData = {
      user,
      // Add other data as needed
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (protected route)
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { username, email, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { 
        $set: { 
          username,
          email,
          bio,
          // Add other fields as needed
        }
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's comparisons (protected route)
router.get('/:userId/comparisons', verifyToken, async (req, res) => {
  try {
    // Check if user is accessing their own comparisons
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to access these comparisons' });
    }

    // Here you would fetch the user's comparisons from your database
    // This is just a placeholder - implement according to your data model
    const comparisons = []; // Replace with actual database query

    res.json(comparisons);
  } catch (error) {
    console.error('Error fetching comparisons:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;