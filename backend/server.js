require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');

// Import routes
const installersRoutes = require('./routes/installers');
const batteriesRoutes = require('./routes/batteries');
const adminDashboardRoutes = require('./routes/adminDashboard');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const forumsRoutes = require('./routes/forums');

// Import database connection
const { connectToMongo } = require('./mongoDb');
const { specsDb } = require('./db');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Initialize server function
const initializeServer = async () => {
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Session configuration
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your_session_secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      }
    }));

    // Basic routes
    app.get('/', (req, res) => res.json("From backend"));
    
    app.get('/api/debug-session', (req, res) => {
      res.json({
        session: req.session,
        sessionID: req.sessionID,
        cookies: req.cookies
      });
    });

    app.get('/api/check-auth', auth, (req, res) => {
      try {
        res.status(200).json({ 
          message: "Authenticated", 
          userId: req.user.id 
        });
      } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ message: "Server error during auth check" });
      }
    });

    // API Routes
    app.use('/installers', installersRoutes);
    app.use('/batteries', batteriesRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/forums', forumsRoutes);
    
    app.use('/api/admin-dashboard', (req, res, next) => {
      console.log('Admin route accessed:', req.method, req.url);
      next();
    }, adminDashboardRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });

    // Start server
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const handleShutdown = async () => {
  try {
    if (specsDb) {
      await new Promise((resolve, reject) => {
        specsDb.end(err => {
          if (err) {
            console.error('Error during SQL disconnection:', err);
            reject(err);
          } else {
            console.log('SQL Database connection closed.');
            resolve();
          }
        });
      });
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Initialize server
initializeServer();

// Handle shutdown signals
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

module.exports = app;