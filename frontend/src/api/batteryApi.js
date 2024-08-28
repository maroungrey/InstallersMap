import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

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
      voltage: voltage === 'All Voltages' ? '' : voltage,
      chemistry,
      sortBy,
      searchTerm,
      page,
      limit
    };

    console.log('Sending request with params:', params);

    const response = await axios.get(`${API_BASE_URL}/batteries`, { params });

    console.log('Received response:', response.data);

    return {
      data: response.data.batteries || [],
      allBrands: response.data.allBrands || [],
      hasMore: response.data.currentPage < response.data.totalPages,
      totalCount: response.data.totalCount,
    };
  } catch (error) {
    console.error('Error fetching batteries:', error);
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error. Please check if the server is running and accessible.');
    }
    return {
      data: [],
      allBrands: [],
      hasMore: false,
      totalCount: 0,
      error: error.message
    };
  }
};