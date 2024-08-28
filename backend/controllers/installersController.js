const { installersDb } = require('../db');

const processInstallers = (installers) => {
    return installers.map(installer => ({
        id: installer.id,
        name: installer.name,
        address: installer.address,
        phone: installer.phone,
        website: installer.website,
        pin: {
            lat: installer.latitude,
            lng: installer.longitude
        },
        // Add any additional fields you want to include
    }));
};

const getInstallers = async (table) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM \`${table}\``;
        installersDb.query(sql, (err, results) => {
            if (err) {
                console.error(`Error fetching installers from ${table}:`, err);
                reject(err);
            } else {
                const processedInstallers = processInstallers(results);
                resolve(processedInstallers);
            }
        });
    });
};

const getTables = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SHOW TABLES";
        installersDb.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching tables:', err);
                reject(err);
            } else {
                const tables = results.map(result => Object.values(result)[0]);
                resolve(tables);
            }
        });
    });
};

module.exports = {
    getInstallers,
    getTables
};