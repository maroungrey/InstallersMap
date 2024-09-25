require('dotenv').config();
const express = require('express');
const cors = require('cors');
const installersRoutes = require('./routes/installers');
const batteriesRoutes = require('./routes/batteries');
const adminDashboardRoutes = require('./routes/adminDashboard');

const app = express();
app.use(cors());
app.use(express.json());

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

  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
  });

process.on('SIGINT', () => {
    const { specsDb } = require('./db');
    if (specsDb) {
        specsDb.end((err) => {
            if (err) {
                console.log('Error during disconnection:', err);
            }
            console.log('Database connection closed.');
            process.exit();
        });
    } else {
        process.exit();
    }
});