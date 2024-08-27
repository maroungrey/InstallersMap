const { specsDb } = require('../db');
const util = require('util');

// Promisify the query function
const query = util.promisify(specsDb.query).bind(specsDb);

exports.getBatteries = async (req, res) => {
    console.log('getBatteries function called');
    try {
        // Fetch all unique brands first
        const brandResults = await query('SELECT DISTINCT Brand FROM `48v` ORDER BY Brand');
        console.log('Brand query results:', brandResults);
        const allBrands = brandResults.map(result => result.Brand);
        console.log('Mapped allBrands:', allBrands);

        const { brands, voltage, chemistry, sortBy, searchTerm, page = 1, limit = 12 } = req.query;

        let queryStr = 'SELECT * FROM `48v` WHERE 1=1';
        const queryParams = [];

        if (brands && brands.length > 0) {
            const brandArray = brands.split(',');
            queryStr += ` AND Brand IN (${brandArray.map(() => '?').join(',')})`;
            queryParams.push(...brandArray);
        }

        if (voltage) {
            queryStr += ' AND `Nominal V` = ?';
            queryParams.push(voltage);
        }

        if (chemistry) {
            queryStr += ' AND Chemistry = ?';
            queryParams.push(chemistry);
        }

        if (searchTerm) {
            queryStr += ' AND (Brand LIKE ? OR Name LIKE ?)';
            queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }

        if (sortBy) {
            switch (sortBy) {
                case 'capacity':
                    queryStr += ' ORDER BY `Ah Capacity` DESC';
                    break;
                case 'warranty':
                    queryStr += ' ORDER BY Warranty DESC';
                    break;
                case 'weight':
                    queryStr += ' ORDER BY Weight ASC';
                    break;
                case 'kWh':
                    queryStr += ' ORDER BY kWh DESC';
                    break;
                default:
                    queryStr += ' ORDER BY id ASC';
            }
        }

        // Add pagination
        const offset = (page - 1) * limit;
        queryStr += ' LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        console.log('Executing query:', queryStr);
        console.log('Query parameters:', queryParams);

        const batteries = await query(queryStr, queryParams);
        console.log('Fetched batteries:', batteries);

        // Get total count for pagination
        const totalCountResult = await query('SELECT COUNT(*) as total FROM `48v`');
        const totalCount = totalCountResult[0].total;
        console.log('Total count:', totalCount);

        const response = {
            batteries,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
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