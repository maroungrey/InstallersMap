# Backend Documentation

## Overview

This backend system is designed to handle installer and battery data. It uses Express.js for routing, MySQL for data storage, and implements caching for improved performance. The system is structured with separate routes, controllers, and services for installers and batteries.

## Database Structure

The system uses two separate MySQL databases:

1. `installers`: Contains tables for different types of installers (e.g., 'golf-cart').
2. `specs`: Contains tables for battery specifications at different voltages (48v, 36v, 24v).

## API Endpoints

### Installers

#### 1. Get Nearby Installers

- **Endpoint**: `GET /installers/nearby`
- **Query Parameters**:
  - `table` (string, default: 'golf-cart'): The installer table to query.
  - `centerLat` (float): Latitude of the center point.
  - `centerLng` (float): Longitude of the center point.
  - `radius` (float, default: 50): Search radius in miles.
  - `limit` (integer, default: 20): Maximum number of results to return.
- **Response**: Array of installer objects.
- **Example**:
  ```
  GET /installers/nearby?table=golf-cart&centerLat=37.7749&centerLng=-122.4194&radius=30&limit=10
  ```

#### 2. Get Map Installers

- **Endpoint**: `GET /installers/map`
- **Query Parameters**:
  - `table` (string, default: 'golf-cart'): The installer table to query.
  - `minLat` (float): Minimum latitude of the bounding box.
  - `maxLat` (float): Maximum latitude of the bounding box.
  - `minLng` (float): Minimum longitude of the bounding box.
  - `maxLng` (float): Maximum longitude of the bounding box.
  - `zoom` (integer): Current map zoom level.
- **Response**: Array of installer objects or clusters, depending on zoom level.
- **Example**:
  ```
  GET /installers/map?table=golf-cart&minLat=37.7&maxLat=37.8&minLng=-122.5&maxLng=-122.4&zoom=12
  ```

#### 3. Get Installer Tables

- **Endpoint**: `GET /installers/tables`
- **Response**: Array of table names in the installers database.
- **Example**:
  ```
  GET /installers/tables
  ```

### Batteries

#### 1. Get Batteries

- **Endpoint**: `GET /batteries`
- **Query Parameters**:
  - `brands` (string): Comma-separated list of brands to filter by.
  - `voltage` (string): Voltage to filter by (24, 36, or 48).
  - `chemistry` (string): Battery chemistry to filter by.
  - `sortBy` (string): Field to sort by ('Total kWh', 'Full Warranty Years', or 'Ah Capacity').
  - `searchTerm` (string): Term to search in Brand and Name fields.
  - `page` (integer, default: 1): Page number for pagination.
  - `limit` (integer, default: 12): Number of results per page.
- **Response**: Object containing:
  - `batteries`: Array of battery objects.
  - `currentPage`: Current page number.
  - `totalPages`: Total number of pages.
  - `totalCount`: Total number of batteries matching the query.
  - `allBrands`: Array of all available brands.
- **Example**:
  ```
  GET /batteries?brands=Brand1,Brand2&voltage=48&chemistry=Lithium&sortBy=Total%20kWh&searchTerm=battery&page=1&limit=20
  ```

## Data Structures

### Installer Object

```javascript
{
  type: 'pin',
  id: number,
  name: string,
  address: string,
  phone: string,
  website: string,
  lat: number,
  lng: number
}
```

### Cluster Object

```javascript
{
  type: 'cluster',
  count: number,
  lat: number,
  lng: number
}
```

### Battery Object

```javascript
{
  Brand: string,
  Name: string,
  Chemistry: string,
  'Total kWh': number,
  'Full Warranty Years': number,
  'Ah Capacity': number,
  // Other fields may be present depending on the battery specification
  sourceTable: string // Indicates the voltage (e.g., '48v', '36v', '24v')
}
```

## Implementation Notes

1. **Caching**: The system uses caching for map installer queries. Cache keys are based on query parameters and have a TTL of 1 hour.

2. **Spatial Data**: The installers database uses MySQL's spatial features for efficient location-based queries.

3. **Dynamic Clustering**: The map installers endpoint dynamically adjusts between individual pins, mixed view, and clusters based on the zoom level:
   - Zoom < 5: Clustered view
   - 5 ≤ Zoom < 8: Mixed cluster and pins view
   - Zoom ≥ 8: Individual installers view

4. **Error Handling**: All endpoints include error handling that logs errors and sends appropriate HTTP responses. In development mode, error stacks are included in the response.

5. **Input Validation**: The battery endpoint includes input sanitization and validation, particularly for pagination parameters.

6. **Cross-Database Queries**: The battery endpoint queries multiple voltage tables and combines the results.

## Frontend Implementation Guidelines

1. **Map Integration**: When implementing the map feature, use the `/installers/map` endpoint. Update the map data when the user pans or zooms the map, passing the new bounding box coordinates and zoom level.

2. **Installer Details**: When displaying individual installer details, use the data returned from the `/installers/map` endpoint when zoomed in, or fetch additional details if necessary.

3. **Battery Filtering**: Implement filter controls for brands, voltage, chemistry, and sorting. Use these to construct the query parameters for the `/batteries` endpoint.

4. **Pagination**: Implement pagination controls using the `currentPage` and `totalPages` values returned from the `/batteries` endpoint. Update the `page` query parameter when the user navigates between pages.

5. **Search**: Implement a search input that updates the `searchTerm` query parameter for the `/batteries` endpoint.

6. **Error Handling**: Be prepared to handle and display error messages returned from the API in case of server errors or invalid requests.

By following these guidelines and referring to this documentation, you should be able to implement the frontend to correctly interact with the backend API and handle the data appropriately.
