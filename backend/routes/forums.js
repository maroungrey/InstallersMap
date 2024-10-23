const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all posts (with pagination and filters)
router.get('/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = category ? { category } : {};
    
    const posts = await Post.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'username photoUrl')
      .lean();

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post with comments
router.get('/posts/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username photoUrl')
      .lean();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username photoUrl')
      .sort('createdAt')
      .lean();

    res.json({ post, comments });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new post (protected)
router.post('/posts', auth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    const post = new Post({
      title,
      content,
      category,
      author: req.userId
    });

    await post.save();

    // Update user's post count
    await User.findByIdAndUpdate(req.userId, { $inc: { 'stats.posts': 1 } });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username photoUrl')
      .lean();

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to post (protected)
router.post('/posts/:postId/comments', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      content: req.body.content,
      author: req.userId,
      post: req.params.postId
    });

    await comment.save();

    // Update post's comment count
    await Post.findByIdAndUpdate(req.params.postId, {
      $inc: { commentsCount: 1 }
    });

    // Update user's comment count
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.comments': 1 }
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username photoUrl')
      .lean();

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post (protected)
router.post('/posts/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const hasLiked = post.likedBy.includes(req.userId);
    const updateOperation = hasLiked
      ? { $pull: { likedBy: req.userId }, $inc: { likesCount: -1 } }
      : { $addToSet: { likedBy: req.userId }, $inc: { likesCount: 1 } };

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      updateOperation,
      { new: true }
    ).populate('author', 'username photoUrl');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (protected)
router.delete('/posts/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: req.params.postId });
    await Post.findByIdAndDelete(req.params.postId);

    // Update user's post count
    await User.findByIdAndUpdate(req.userId, { $inc: { 'stats.posts': -1 } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;