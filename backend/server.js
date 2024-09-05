require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initialize } = require('./db');
const installersRoutes = require('./routes/installers');
const batteriesRoutes = require('./routes/batteries');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    return res.json("From backend");
});

app.use('/installers', installersRoutes);
app.use('/batteries', batteriesRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 8081;

initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize the database:', err);
        process.exit(1);
    });

process.on('SIGINT', () => {
    const { specsDb, installersDb } = require('./db');
    [specsDb, installersDb].forEach(db => {
        if (db) {
            db.end(err => {
                if (err) {
                    console.log('Error during disconnection:', err);
                }
            });
        }
    });
    console.log('Database connections closed.');
    process.exit();
});