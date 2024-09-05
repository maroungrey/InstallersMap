const mysql = require('mysql');

const createPool = (database) => mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database,
    connectionLimit: 10, // adjust based on your needs
    queueLimit: 0
});

const installersDb = createPool('installers');
const specsDb = createPool('specs');

const getTables = () => {
    return new Promise((resolve, reject) => {
        installersDb.query('SHOW TABLES', (err, results) => {
            if (err) {
                reject(err);
            } else {
                const tables = results.map(row => Object.values(row)[0]);
                resolve(tables);
            }
        });
    });
};

const queryPromise = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const initializeSpatialIndices = async () => {
  try {
    const tables = await getTables();
    for (const table of tables) {
      const addLocationColumn = `
        ALTER TABLE \`${table}\`
        ADD COLUMN IF NOT EXISTS location POINT;
      `;
      const updateLocationData = `
        UPDATE \`${table}\`
        SET location = POINT(longitude, latitude)
        WHERE location IS NULL;
      `;
      const addSpatialIndex = `
        ALTER TABLE \`${table}\`
        ADD SPATIAL INDEX IF NOT EXISTS(location);
      `;

      await queryPromise(installersDb, addLocationColumn);
      await queryPromise(installersDb, updateLocationData);
      await queryPromise(installersDb, addSpatialIndex);
      console.log(`Spatial index created successfully for table: ${table}`);
    }
  } catch (err) {
    console.error('Error initializing spatial indices:', err);
  }
};

let isInitialized = false;

const initialize = () => {
    if (isInitialized) return Promise.resolve();

    return new Promise((resolve, reject) => {
        initializeSpatialIndices()
            .then(() => {
                isInitialized = true;
                resolve();
            })
            .catch(reject);
    });
};

module.exports = {
  installersDb,
  specsDb,
  getTables,
  initialize,
  queryPromise
};