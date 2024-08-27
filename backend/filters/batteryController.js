const db = require('../db');

exports.getBatteries = async (req, res) => {
    try {
        // Fetch all unique brands first
        const [brandResults] = await db.query('SELECT DISTINCT Brand FROM batteries ORDER BY Brand');
        const allBrands = brandResults.map(result => result.Brand);

        const { brands, voltage, chemistry, sortBy, searchTerm, page = 1, limit = 12 } = req.query;

        let query = 'SELECT * FROM batteries WHERE 1=1';
        const queryParams = [];

        if (brands && brands.length > 0) {
            const brandArray = brands.split(',');
            query += ` AND Brand IN (${brandArray.map(() => '?').join(',')})`;
            queryParams.push(...brandArray);
        }

        if (voltage) {
            query += ' AND "Nominal V" = ?';
            queryParams.push(voltage);
        }

        if (chemistry) {
            query += ' AND Chemistry = ?';
            queryParams.push(chemistry);
        }

        if (searchTerm) {
            query += ' AND (Brand LIKE ? OR Name LIKE ?)';
            queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }

        if (sortBy) {
            switch (sortBy) {
                case 'capacity':
                    query += ' ORDER BY "Ah Capacity" DESC';
                    break;
                case 'warranty':
                    query += ' ORDER BY Warranty DESC';
                    break;
                case 'weight':
                    query += ' ORDER BY Weight ASC';
                    break;
                case 'kWh':
                    query += ' ORDER BY kWh DESC';
                    break;
                default:
                    query += ' ORDER BY id ASC';
            }
        }

        // Add pagination
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(limit, offset);

        const [batteries] = await db.query(query, queryParams);

        // Get total count for pagination
        const [totalCountResult] = await db.query('SELECT COUNT(*) as total FROM batteries');
        const totalCount = totalCountResult[0].total;

        res.json({
            batteries,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            allBrands
        });
    } catch (error) {
        console.error('Error fetching batteries:', error);
        res.status(500).json({ message: 'Error fetching batteries' });
    }
};