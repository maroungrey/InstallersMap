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
    
    // This is where the error is happening. We need to use req.user.id
    const post = new Post({
      title,
      content,
      category,
      author: req.user.id  // Change from req.userId to req.user.id to match your auth middleware
    });

    await post.save();

    // Update user's post count
    await User.findByIdAndUpdate(req.user.id, { $inc: { 'stats.posts': 1 } });

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
      author: req.user.id,
      post: req.params.postId
    });

    await comment.save();

    // Update post's comment count
    await Post.findByIdAndUpdate(req.params.postId, {
      $inc: { commentsCount: 1 }
    });

    // Update user's comment count
    await User.findByIdAndUpdate(req.user.id, {
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

    const hasLiked = post.likedBy.includes(req.user.id);
    const updateOperation = hasLiked
      ? { 
          $pull: { likedBy: req.user.id }, 
          $inc: { likesCount: -1 } 
        }
      : { 
          $addToSet: { likedBy: req.user.id }, 
          $inc: { likesCount: 1 } 
        };

    // Update post first
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      updateOperation,
      { new: true }
    ).populate('author', 'username photoUrl');

    // Only update reputation if this is the first time liking/unliking
    if (!hasLiked) {
      await User.findByIdAndUpdate(
        post.author,
        { $inc: { 'stats.reputation': 1 } }
      );
    } else {
      await User.findByIdAndUpdate(
        post.author,
        { $inc: { 'stats.reputation': -1 } }
      );
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/posts/:postId/dislike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const hasDisliked = post.dislikedBy?.includes(req.user.id);
    const updateOperation = hasDisliked
      ? { 
          $pull: { dislikedBy: req.user.id }, 
          $inc: { dislikesCount: -1 } 
        }
      : { 
          $addToSet: { dislikedBy: req.user.id }, 
          $inc: { dislikesCount: 1 } 
        };

    // Update post first
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      updateOperation,
      { new: true }
    ).populate('author', 'username photoUrl');

    // Only update reputation if this is the first time disliking/undisliking
    if (!hasDisliked) {
      await User.findByIdAndUpdate(
        post.author,
        { $inc: { 'stats.reputation': -1 } }
      );
    } else {
      await User.findByIdAndUpdate(
        post.author,
        { $inc: { 'stats.reputation': 1 } }
      );
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error disliking/undisliking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (soft delete)
router.delete('/posts/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Soft delete
    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment (soft delete)
router.delete('/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Soft delete
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    await comment.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update the get posts route to handle deleted posts
router.get('/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = category ? { category, isDeleted: false } : { isDeleted: false };
    
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

// Update the get single post route to handle deleted posts and comments
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

    // Modify deleted content
    if (post.isDeleted) {
      post.content = '[deleted]';
      post.author = { username: '[deleted]' };
    }

    // Modify deleted comments
    const modifiedComments = comments.map(comment => {
      if (comment.isDeleted) {
        return {
          ...comment,
          content: '[deleted]',
          author: { username: '[deleted]' }
        };
      }
      return comment;
    });

    res.json({ post, comments: modifiedComments });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit post (protected)
router.put('/posts/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    // Check if post is still editable (within 24 hours)
    const postDate = new Date(post.createdAt);
    const now = new Date();
    const diffHours = (now - postDate) / (1000 * 60 * 60);
    if (diffHours >= 24) {
      return res.status(403).json({ message: 'Post can only be edited within 24 hours of creation' });
    }

    post.content = req.body.content;
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username photoUrl')
      .lean();

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Report post (protected)
router.post('/posts/:postId/report', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user has already reported this post
    const existingReport = post.reports?.find(
      report => report.reportedBy.toString() === req.user.id
    );

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this post' });
    }

    post.reports = post.reports || [];
    post.reports.push({
      reportedBy: req.user.id,
      reason: req.body.reason,
      createdAt: new Date()
    });

    await post.save();
    res.json({ message: 'Post reported successfully' });
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit comment (protected)
router.put('/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    // Check if comment is still editable (within 24 hours)
    const commentDate = new Date(comment.createdAt);
    const now = new Date();
    const diffHours = (now - commentDate) / (1000 * 60 * 60);
    if (diffHours >= 24) {
      return res.status(403).json({ message: 'Comment can only be edited within 24 hours of creation' });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'username photoUrl')
      .lean();

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Report comment (protected)
router.post('/comments/:commentId/report', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user has already reported this comment
    const existingReport = comment.reports?.find(
      report => report.reportedBy.toString() === req.user.id
    );

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this comment' });
    }

    comment.reports = comment.reports || [];
    comment.reports.push({
      reportedBy: req.user.id,
      reason: req.body.reason,
      createdAt: new Date()
    });

    await comment.save();
    res.json({ message: 'Comment reported successfully' });
  } catch (error) {
    console.error('Error reporting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment (protected)
router.delete('/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.isDeleted = true;
    comment.content = '[deleted]';
    comment.deletedAt = new Date();
    await comment.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;