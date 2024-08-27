require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

process.on('SIGINT', () => {
    // Assuming you have a db connection to close
    if (db) {
        db.end((err) => {
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