const { specsDb } = require('../db');

const getAllBatteries = (callback) => {
    const sql = "SELECT * FROM `48v`";
    specsDb.query(sql, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

module.exports = {
    getAllBatteries
};