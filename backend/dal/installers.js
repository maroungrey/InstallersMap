const { installersDb } = require('../db');

const getAllInstallers = (callback) => {
    const sql = "SELECT * FROM `golf-cart`";
    installersDb.query(sql, (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

module.exports = {
    getAllInstallers
};