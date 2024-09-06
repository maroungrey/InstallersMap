# Backend Documentation

## Overview

This backend application is built using Node.js and Express.js, providing APIs for managing installer and battery data. It utilizes MySQL for data storage and implements caching and spatial querying for improved performance.

## Core Components

1. Server (server.js)
2. Database Connection (db.js)
3. Caching (cache.js)
4. Routes (installers.js, batteries.js)
5. Controllers (installersController.js, batteryController.js)
6. Services (installersService.js)
7. Utilities (mapUtils.js, cacheUtils.js)

## Detailed Component Breakdown

### 1. Server (server.js)

The main entry point of the application. It:
- Sets up the Express application
- Configures middleware (cors, json parsing)
- Mounts routes for installers and batteries
- Implements error handling
- Listens on a specified port
- Handles graceful shutdown, closing database connections

### 2. Database Connection (db.js)

Manages database connections using MySQL. It:
- Creates connection pools for 'installers' and 'specs' databases
- Provides utility functions for database queries
- Initializes spatial indices for improved geospatial queries
- Exports database instances and utility functions

### 3. Caching (cache.js)

Implements a caching mechanism using node-cache. It provides:
- Functions to set, get, and delete cached items
- A function to flush the entire cache

### 4. Routes

#### 4.1 Installers Routes (installers.js)

Defines API endpoints for installer-related operations:
- GET /nearby: Fetch nearby installers
- GET /map: Get installers for map display
- GET /tables: Retrieve all table names

#### 4.2 Batteries Routes (batteries.js)

Defines API endpoint for battery-related operations:
- GET /: Fetch battery data with various filtering options

### 5. Controllers

#### 5.1 Installers Controller (installersController.js)

Acts as an intermediary between routes and services for installer data:
- getNearbyInstallers: Fetches nearby installers
- getMapInstallers: Retrieves installers for map display
- getTables: Gets all table names

#### 5.2 Battery Controller (batteryController.js)

Handles complex logic for fetching and processing battery data:
- getBatteries: Retrieves battery data with filtering, sorting, and pagination

### 6. Services (installersService.js)

Contains business logic for installer-related operations:
- getNearbyInstallers: Performs spatial queries to find nearby installers
- getMapInstallers: Fetches installers within a bounding box and clusters them
- getTables: Retrieves all table names from the installers database
- Implements caching for all exported functions

### 7. Utilities

#### 7.1 Map Utilities (mapUtils.js)

Provides functions for geospatial operations:
- getAdaptiveRadius: Calculates search radius based on zoom level
- clusterInstallers: Groups nearby installers into clusters
- Various helper functions for distance calculations

#### 7.2 Cache Utilities (cacheUtils.js)

Offers a wrapper function to add caching to other functions:
- cacheWrapper: Wraps a function with caching functionality

## Key Features

1. **Geospatial Queries**: Utilizes MySQL's spatial capabilities for efficient location-based queries.
2. **Caching**: Implements caching to improve performance of frequently accessed data.
3. **Clustering**: Groups nearby installers for efficient map display at various zoom levels.
4. **Flexible Filtering**: Supports various filtering options for battery data (brand, voltage, chemistry, etc.).
5. **Pagination**: Implements pagination for large result sets.
6. **Error Handling**: Includes comprehensive error handling and logging.

## API Endpoints

### Installers

1. GET /installers/nearby
   - Parameters: table, centerLat, centerLng, radius, limit
   - Returns nearby installers based on given location and radius

2. GET /installers/map
   - Parameters: table, minLat, maxLat, minLng, maxLng, zoom
   - Returns installers within the specified bounding box, clustered based on zoom level

3. GET /installers/tables
   - Returns a list of all tables in the installers database

### Batteries

1. GET /batteries
   - Parameters: brands, voltage, chemistry, sortBy, searchTerm, page, limit
   - Returns battery data based on specified filters, sorted and paginated

## Database Structure

The application uses two main databases:

1. **installers**: Contains tables with installer data, including spatial information.
2. **specs**: Contains tables with battery specifications, separated by voltage (48v, 36v, 24v).

## Error Handling and Logging

- The application includes error handling middleware in the main server file.
- Controllers and services include try-catch blocks to handle and log errors.
- In development mode, detailed error information is returned to the client.

## Performance Considerations

1. Connection pooling is used for database connections to manage resources efficiently.
2. Caching is implemented for frequently accessed data to reduce database load.
3. Spatial indices are used to optimize location-based queries.
4. Clustering is implemented for efficient display of large numbers of installers on maps.

## Security Considerations

1. Input validation and sanitization are implemented, particularly for database queries.
2. CORS is configured to control access to the API.
3. Environment variables are used for sensitive configuration (database credentials, etc.).

This documentation provides an overview of the backend structure and functionality. For specific implementation details, refer to the individual files and their comments.

# Backend Improvement Suggestions

Given that this backend logic will primarily serve the battery comparison page and the map of installers, with the rest of the website (blog, web forum, etc.) built on a NoSQL database, here are some focused suggestions for improvements:

## Installer Map Feature

1. **Server-side clustering**: Implement clustering logic on the server for lower zoom levels. This can significantly reduce the amount of data sent to the client and improve performance for areas with many installers.

2. **Caching for map areas**: Implement caching for frequently accessed map areas. This can reduce database load and improve response times for popular locations.

3. **Optimize spatial queries**: Review and optimize the spatial queries used for fetching installers. Consider using more efficient spatial index types if available in your MySQL version.

4. **Progressive loading**: Implement a system for progressive loading of installer data as the user pans or zooms the map, rather than loading all data at once.

## Battery Comparison Feature

1. **Optimize database queries**:
   - Use a UNION ALL query to fetch from all voltage tables in one query, reducing the number of database round-trips.
   - Push filtering, sorting, and pagination to the database level to reduce the amount of data processed in the application layer.

2. **Query result caching**: Implement caching for query results, especially for queries with common filter combinations.

3. **API optimization**:
   - Split the API into smaller, focused endpoints (e.g., separate endpoint for fetching brands).
   - Implement GraphQL for more flexible querying if the frontend requires complex, varied data fetching.

4. **Implement data versioning**: If battery specs are updated frequently, consider implementing a versioning system to track changes over time.

## General Improvements

1. **Input validation and sanitization**: Enhance input validation and sanitization, especially for user-provided query parameters.

2. **Error handling and logging**: Implement more comprehensive error handling and logging. Consider using a structured logging format for easier parsing and analysis.

3. **Performance monitoring**: Add performance monitoring for database queries and API endpoints. This can help identify bottlenecks and areas for optimization.

4. **Rate limiting**: Implement a rate limiting mechanism to prevent abuse and ensure fair usage of the API.

5. **Code structure**:
   - Break down large controller functions (especially in batteryController.js) into smaller, more focused functions for better maintainability.
   - Consider implementing a service layer to separate business logic from controllers.

6. **Security**:
   - Ensure all user inputs are properly validated and escaped to prevent SQL injection attacks.
   - If not already present, implement authentication and authorization for sensitive operations.

7. **Scalability**:
   - Implement connection pooling for the 'specs' database if not already done.
   - Evaluate the need for read replicas if read operations become a bottleneck.

8. **API documentation**: Generate and maintain API documentation using tools like Swagger/OpenAPI.

## Integration with NoSQL Database

1. **Unified API gateway**: Consider implementing an API gateway that can route requests to either the SQL-based backend for battery and installer data or the NoSQL-based backend for blog and forum data.

2. **Consistent error handling**: Ensure that error handling and response formats are consistent between the SQL and NoSQL backends for a unified API experience.

3. **Cross-database reporting**: If there's a need for reports or analytics that span both SQL and NoSQL data, consider implementing a data warehouse or using a service that can query both databases.

4. **Caching strategy**: Develop a unified caching strategy that works across both SQL and NoSQL data to ensure consistent performance.

These suggestions aim to improve the performance, scalability, and maintainability of the backend, with a focus on the battery comparison and installer map features. The integration points with the future NoSQL-based components are also considered to ensure a cohesive overall system.