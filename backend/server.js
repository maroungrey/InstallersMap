// require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password:'',
    database: 'installers'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.get('/', (req, res) => {
    return res.json("From backend");
});

app.get('/installers', (req, res) => {
    const sql = "SELECT * from `golf-cart`";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});

process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.log('Error during disconnection:', err);
        }
        console.log('Database connection closed.');
        process.exit();
    });
});
