const mysql = require('mysql');

const createConnection = (database) => mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database
});

const installersDb = createConnection('installers');
const specsDb = createConnection('specs');

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

            await queryPromise(addLocationColumn);
            await queryPromise(updateLocationData);
            await queryPromise(addSpatialIndex);
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
        installersDb.connect((err) => {
            if (err) {
                console.error('Installers database connection failed:', err.stack);
                return reject(err);
            }
            console.log('Connected to Installers database.');
            initializeSpatialIndices()
                .then(() => {
                    isInitialized = true;
                    resolve();
                })
                .catch(reject);
        });

        specsDb.connect((err) => {
            if (err) {
                console.error('Specs database connection failed:', err.stack);
            } else {
                console.log('Connected to Specs database.');
            }
        });
    });
};

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
  specsDb,
  getTables,
  initialize,
  queryPromise
};