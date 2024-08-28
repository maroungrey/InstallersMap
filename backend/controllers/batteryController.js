const { specsDb } = require('../db');
const util = require('util');

const query = util.promisify(specsDb.query).bind(specsDb);

const allowedSortOptions = ['Total kWh', 'Full Warranty Years', 'Ah Capacity'];
const voltageTables = ['48v', '36v', '24v'];

exports.getBatteries = async (req, res) => {
    console.log('getBatteries function called with query:', req.query);
    try {
        const brandResults = await Promise.all(voltageTables.map(table => 
            query(`SELECT DISTINCT Brand FROM ${specsDb.escapeId(table)} ORDER BY Brand`)
        ));
        const allBrands = [...new Set(brandResults.flat().map(result => result.Brand))];

        const { brands, voltage, chemistry, sortBy, searchTerm, page = 1, limit = 12 } = req.query;

        const selectedBrands = brands ? brands.split(',').filter(brand => allBrands.includes(brand)) : [];

        let allResults = [];
        let totalCount = 0;

        for (const table of voltageTables) {
            if (voltage && table !== `${voltage}v`) continue;

            let queryStr = `SELECT *, '${table}' AS sourceTable FROM ${specsDb.escapeId(table)} WHERE 1=1`;
            const queryParams = [];

            if (selectedBrands.length > 0) {
                queryStr += ` AND Brand IN (${selectedBrands.map(() => '?').join(',')})`;
                queryParams.push(...selectedBrands);
            }

            if (chemistry) {
                queryStr += ' AND Chemistry = ?';
                queryParams.push(chemistry);
            }

            if (searchTerm) {
                const searchPattern = `%${searchTerm.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;
                queryStr += ' AND (Brand LIKE ? OR Name LIKE ?)';
                queryParams.push(searchPattern, searchPattern);
            }

            console.log(`Executing query for ${table}:`, queryStr);
            console.log('Query parameters:', queryParams);

            const results = await query(queryStr, queryParams);
            allResults = allResults.concat(results);
            totalCount += results.length;
        }

        // Sort the combined results
        if (sortBy && allowedSortOptions.includes(sortBy)) {
            allResults.sort((a, b) => {
                switch (sortBy) {
                    case 'Total kWh':
                        return parseFloat(b['Total kWh']) - parseFloat(a['Total kWh']); // Highest kWh
                    case 'Full Warranty Years':
                        return parseInt(b['Full Warranty Years']) - parseInt(a['Full Warranty Years']); // Highest Warranty
                    case 'Ah Capacity':
                        return parseFloat(b['Ah Capacity']) - parseFloat(a['Ah Capacity']); // Highest Capacity
                    default:
                        return 0;
                }
            });
        }

        const sanitizedPage = Math.max(1, Math.min(1000, parseInt(page) || 1));
        const sanitizedLimit = Math.max(1, Math.min(100, parseInt(limit) || 12));
        const startIndex = (sanitizedPage - 1) * sanitizedLimit;
        const endIndex = startIndex + sanitizedLimit;

        const paginatedResults = allResults.slice(startIndex, endIndex);

        const response = {
            batteries: paginatedResults,
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