import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

console.log('API_BASE_URL:', API_BASE_URL);

export const fetchBatteries = async ({
  brands = [],
  voltage = '',
  chemistry = '',
  sortBy = '',
  searchTerm = '',
  page = 1,
  limit = 12
}) => {
  try {
    const params = {
      brands: brands.join(','),
      voltage,
      chemistry,
      sortBy,
      searchTerm,
      page,
      limit
    };

    console.log('Fetching batteries with params:', params);

    const response = await axios.get(`${API_BASE_URL}/batteries`, { params });

    console.log('Raw API Response:', response);
    console.log('API Response data:', response.data);

    // Ensure allBrands is extracted correctly
    const allBrands = response.data.allBrands || [];
    console.log('Extracted allBrands:', allBrands);

    return {
      data: response.data.batteries || [],
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
      totalCount: response.data.totalCount,
      allBrands: allBrands,
      hasMore: response.data.currentPage < response.data.totalPages
    };
  } catch (error) {
    console.error('Error fetching batteries:', error);
    throw error;
  }
};