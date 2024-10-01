require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToMongo, client } = require('./mongoDb');
const installersRoutes = require('./routes/installers');
const batteriesRoutes = require('./routes/batteries');
const adminDashboardRoutes = require('./routes/adminDashboard');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB before starting the server
connectToMongo()
  .then(database => {
    db = database;
    console.log("MongoDB connected successfully");
    
    // Start the server after successful database connection
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });

app.get('/', (req, res) => {
    return res.json("From backend");
});

app.use('/installers', installersRoutes);
app.use('/batteries', batteriesRoutes);

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
    
    if (client) {
        await client.close();
        console.log('MongoDB connection closed.');
    }
    
    process.exit();
});