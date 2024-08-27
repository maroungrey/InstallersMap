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

specsDb.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
    }
});

module.exports = {
    installersDb,
    specsDb
};