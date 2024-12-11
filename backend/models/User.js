const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  realName: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  bio: {
    type: String,
    default: ''
  },
  photoUrl: {
    type: String,
    default: ''
  },
  stats: {
    comments: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    posts: {
      type: Number,
      default: 0
    },
    reputation: {  
      type: Number,
      default: 0
    }
  },
  reports: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('User', UserSchema);