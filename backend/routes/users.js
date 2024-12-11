const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

    const { location, bio, realName } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { 
        $set: { 
          location,
          bio,
          realName,
          lastSeen: new Date()
        }
      },
      { new: true }
    ).select('-password -email'); // Exclude password and email from response

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

// Get user's posts
router.get('/:userId/posts', async (req, res) => {
  try {
    const posts = await Post.find({ 
      author: req.params.userId,
      isDeleted: false 
    })
    .sort('-createdAt')
    .populate('author', 'username photoUrl')
    .lean();

    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's activities (comments and likes)
router.get('/:userId/activities', async (req, res) => {
  try {
    // Get user's comments
    const comments = await Comment.find({
      author: req.params.userId,
      isDeleted: false
    })
    .populate({
      path: 'post',
      select: 'title _id'
    })
    .sort('-createdAt')
    .lean()
    .then(comments => comments.map(comment => ({
      ...comment,
      type: 'comment'
    })));

    // Get posts liked by user
    const likedPosts = await Post.find({
      likedBy: req.params.userId,
      isDeleted: false
    })
    .select('title _id createdAt')
    .lean()
    .then(posts => posts.map(post => ({
      post: { _id: post._id, title: post.title },
      createdAt: post.createdAt,
      type: 'like'
    })));

    // Combine and sort activities
    const activities = [...comments, ...likedPosts]
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password (protected route)
router.put('/:userId/password', verifyToken, async (req, res) => {
  try {
    // Check if user is updating their own password
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to update this password' });
    }

    const { currentPassword, newPassword } = req.body;
    
    // Find user and include password for verification
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update email (protected route)
router.put('/:userId/email', verifyToken, async (req, res) => {
  try {
    // Check if user is updating their own email
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to update this email' });
    }

    const { newEmail, password } = req.body;
    
    // Find user and include password for verification
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Check if new email already exists
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Update email
    user.email = newEmail;
    await user.save();

    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ message: 'Server error' });
  }
});