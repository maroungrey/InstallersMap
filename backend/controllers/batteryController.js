const { specsDb } = require('../db');
const util = require('util');

// Promisify the query function
const query = util.promisify(specsDb.query).bind(specsDb);

// Whitelist of allowed columns for sorting
const allowedSortColumns = ['Ah Capacity', 'Warranty', 'Weight', 'kWh', 'id'];

// List of voltage tables
const voltageTables = ['48v', '36v', '24v']; // Add or remove tables as needed

exports.getBatteries = async (req, res) => {
    console.log('getBatteries function called');
    try {
        // Fetch all unique brands from all tables
        const brandResults = await Promise.all(voltageTables.map(table => 
            query(`SELECT DISTINCT Brand FROM ${specsDb.escapeId(table)} ORDER BY Brand`)
        ));
        const allBrands = [...new Set(brandResults.flat().map(result => result.Brand))];
        console.log('Mapped allBrands:', allBrands);

        const { brands, voltage, chemistry, sortBy, searchTerm, page = 1, limit = 12 } = req.query;

        let queryStr = voltageTables.map(table => `
            SELECT *, '${table}' AS sourceTable FROM ${specsDb.escapeId(table)} WHERE 1=1
        `).join(' UNION ALL ');
        
        const queryParams = [];

        if (brands && brands.length > 0) {
            const brandArray = brands.split(',').filter(brand => allBrands.includes(brand));
            if (brandArray.length > 0) {
                queryStr = queryStr.replace(/WHERE 1=1/g, `WHERE 1=1 AND Brand IN (${brandArray.map(() => '?').join(',')})`);
                queryParams.push(...brandArray.flatMap(brand => Array(voltageTables.length).fill(brand)));
            }
        }

        if (voltage) {
            const voltageTable = `${voltage}v`;
            if (voltageTables.includes(voltageTable)) {
                queryStr = `SELECT *, '${voltageTable}' AS sourceTable FROM ${specsDb.escapeId(voltageTable)} WHERE 1=1`;
                if (queryParams.length > 0) {
                    queryStr += ` AND Brand IN (${queryParams.map(() => '?').join(',')})`;
                }
            }
        }

        if (chemistry) {
            queryStr = queryStr.replace(/WHERE 1=1/g, 'WHERE 1=1 AND Chemistry = ?');
            queryParams.push(...Array(voltageTables.length).fill(chemistry));
        }

        if (searchTerm) {
            const searchPattern = `%${searchTerm.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;
            queryStr = queryStr.replace(/WHERE 1=1/g, 'WHERE 1=1 AND (Brand LIKE ? OR Name LIKE ?)');
            queryParams.push(...Array(voltageTables.length * 2).fill(searchPattern));
        }

        // Wrap the UNION ALL query in a subquery for sorting
        queryStr = `SELECT * FROM (${queryStr}) AS combined`;

        if (sortBy && allowedSortColumns.includes(sortBy.replace(/ DESC| ASC/, ''))) {
            queryStr += ` ORDER BY ${specsDb.escapeId(sortBy)}`;
        } else {
            queryStr += ' ORDER BY id ASC';
        }

        // Add pagination
        const sanitizedPage = Math.max(1, Math.min(1000, parseInt(page) || 1));
        const sanitizedLimit = Math.max(1, Math.min(100, parseInt(limit) || 12));
        const offset = (sanitizedPage - 1) * sanitizedLimit;
        queryStr += ' LIMIT ? OFFSET ?';
        queryParams.push(sanitizedLimit, offset);

        console.log('Executing query:', queryStr);
        console.log('Query parameters:', queryParams);

        const batteries = await query(queryStr, queryParams);
        console.log('Fetched batteries:', batteries);

        // Get total count for filtered results
        const countQueryStr = `SELECT COUNT(*) as total FROM (${queryStr.split(' LIMIT')[0]}) AS count_query`;
        const totalCountResult = await query(countQueryStr, queryParams.slice(0, -2));
        const totalCount = totalCountResult[0].total;
        console.log('Total count:', totalCount);

        const response = {
            batteries,
            currentPage: sanitizedPage,
            totalPages: Math.ceil(totalCount / sanitizedLimit),
            totalCount,
            allBrands
        };

        console.log('Sending response:', response);
        res.json(response);

    } catch (error) {
        console.error('Error fetching batteries:', error);
        res.status(500).json({ 
            message: 'Error fetching batteries',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};