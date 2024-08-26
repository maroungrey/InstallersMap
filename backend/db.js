const mysql = require('mysql');

const createConnection = (database) => mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database
});

const installersDb = createConnection('installers');
const specsDb = createConnection('specs');

installersDb.connect((err) => {
    if (err) {
        console.error('Installers database connection failed:', err.stack);
        return;
    }
    console.log('Connected to Installers database.');
});

specsDb.connect((err) => {
    if (err) {
        console.error('Specs database connection failed:', err.stack);
        return;
    }
    console.log('Connected to Specs database.');
});

module.exports = {
    installersDb,
    specsDb
};