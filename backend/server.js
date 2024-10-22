require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToMongo } = require('./mongoDb');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const installersRoutes = require('./routes/installers');
const batteriesRoutes = require('./routes/batteries');
const adminDashboardRoutes = require('./routes/adminDashboard');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // Add this new line

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// JWT verification middleware
const verifyToken = (req, res, next) => {
  console.log('Session:', req.session);
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);

  const token = req.session.token || (req.cookies && req.cookies.token) || req.headers['x-access-token'];
  
  if (!token) {
    console.log('No token found');
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log('Token verified successfully');
    req.userId = decoded.id;
    next();
  });
};

// Connect to MongoDB before starting the server
connectToMongo()
  .then(() => {
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

    app.get('/', (req, res) => {
      return res.json("From backend");
    });

    // Debugging route to check session
    app.get('/api/debug-session', (req, res) => {
      res.json({
        session: req.session,
        sessionID: req.sessionID,
        cookies: req.cookies
      });
    });

    // Existing routes
    app.use('/installers', installersRoutes);
    app.use('/batteries', batteriesRoutes);
    app.use('/api/auth', authRoutes);

    // Authentication check route
    app.get('/api/check-auth', verifyToken, (req, res) => {
      res.status(200).json({ message: "Authenticated", userId: req.userId });
    });

    // User routes (new)
    app.use('/api/users', userRoutes);

    app.use('/api/admin-dashboard', (req, res, next) => {
      console.log('Admin route accessed:', req.method, req.url);
      next();
    }, adminDashboardRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });

    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  const { specsDb } = require('./db');
  if (specsDb) {
    specsDb.end((err) => {
      if (err) {
        console.log('Error during SQL disconnection:', err);
      }
      console.log('SQL Database connection closed.');
    });
  }
  
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
  
  process.exit();
});